import { NextRequest, NextResponse } from 'next/server';
import { formatCart, printEnhanceCartInConsole, printTarificationsInConsole } from './utils';
import agent from './httpsAgent';
import fetch from 'node-fetch'; // Importar node-fetch en lugar del fetch nativo para uso de agent
import { cartProduct, dataBaseProduct, enhanceCartProduct, PickUpInfo, CustomerData } from './types';

// Endpoint: /api/cart

// Get cart (generar carrito)
export async function GET() {
  const cartID = Math.floor(Math.random() * 40);
  try {
    const response = await fetch(`https://dummyjson.com/carts/${cartID}`)
    const cart = await response.json();
    const formattedCart = await formatCart(cart);
    console.log(formattedCart);
    return NextResponse.json(formattedCart);
  } catch (err) {
    console.log(err + '==> back - GET cart');
  }
}


export async function POST(request: NextRequest) {
  try {
    const cartProductsAndCustomerData = await request.json();
    const cartProducts = cartProductsAndCustomerData.products;
    const customerData = cartProductsAndCustomerData.customer_data;
  
    // Esto debería estar contenido en otra función
    const allProducts = await fetchAllProducts();
    const enhancedCartProducts = mergeCartWithProductDetails(cartProducts, allProducts);
    printEnhanceCartInConsole(enhancedCartProducts);

    if (!canStockBeSatisfied(enhancedCartProducts)) {
      return NextResponse.json({ message: 'No hay stock suficiente para satisfacer la orden' }, { status: 400 });
    }

    const bestCourier = await searchForBestCourierTarification(enhancedCartProducts, customerData);
    
    if (bestCourier.courier === "NotFound") {
      return NextResponse.json({ message: 'No hay couriers disponibles que puedan entregar la orden' }, { status: 400 });
    }

    return NextResponse.json({bestCourier});
  } catch (error) {
    return NextResponse.json({ message: `Error al recibir la orden ${error}` }, { status: 500 });
  }
}


const fetchAllProducts = async () => {
  const allProducts = [];
  let skip = 0; // usando paginación de 10 en 10
  const atributesToSelect = 'id,title,rating,stock,dimensions';

  let response = await fetch(`https://dummyjson.com/products?limit=10&skip=${skip}&select=${atributesToSelect}`);
  let data = await response.json();

  while (true) {
    try {
      response = await fetch(`https://dummyjson.com/products?limit=10&skip=${skip}&select=${atributesToSelect}`);
      data = await response.json();
      if (data.products.length == 0)
        break
      allProducts.push(data.products);
      skip += 10;
    } catch (error) {
      console.log(error + '==> en fetchAllProducts');
    }
  }

  return allProducts.flat();
}


const mergeCartWithProductDetails = ( cartProducts: cartProduct[], allProducts: dataBaseProduct[] ) => {
  const enhancedCartProducts = cartProducts.map( cartProduct => {
    const product = allProducts.find( product => product.id === cartProduct.productId );
    const realStock = Math.floor(product!.stock / product!.rating);
    return {
      id: product!.id, // Usamos id del producto de la base de datos
      price: cartProduct.price,
      quantity: cartProduct.quantity,
      discount: cartProduct.discount,
      title: product!.title,  // Incluimos otros detalles del producto si es necesario
      rating: product!.rating,
      stock: product!.stock,
      dimensions: product!.dimensions,
      realStock: realStock
    };
  });

  return enhancedCartProducts;
}

const canStockBeSatisfied = (enhancedCartProducts: enhanceCartProduct[]) => {
  return enhancedCartProducts.every(product => product.realStock >= product.quantity);
}

const searchForBestCourierTarification = async (enhancedCartProducts: enhanceCartProduct[], customerData: CustomerData) => {
  const bestCourier = {"courier": "NotFound", "price": -1}; 

  const { uderTarification, traeloYaTarification } = await couriersTarification(enhancedCartProducts, customerData);

  if (uderTarification.error && !traeloYaTarification.error) {
    bestCourier.courier = "TraeloYa";
    bestCourier.price = traeloYaTarification.deliveryOffers.pricing.total;
  }
  else if (!uderTarification.error && traeloYaTarification.error) {
    bestCourier.courier = "Uder";
    bestCourier.price = uderTarification.fee;
  }
  else if (!uderTarification.error && !traeloYaTarification.error) {
    bestCourier.courier = uderTarification.fee < traeloYaTarification.deliveryOffers.pricing.total ? "Uder" : "TraeloYa";
    bestCourier.price = uderTarification.fee < traeloYaTarification.deliveryOffers.pricing.total ? uderTarification.fee : traeloYaTarification.deliveryOffers.pricing.total;
  }

  return bestCourier;
}


const couriersTarification = async (enhancedCartProducts: enhanceCartProduct[], dropOffInfo: CustomerData) => {
  const pickUpInfo = {
    name: "Tienda Flapp",
    phone: "+56912345678",
    address: "Juan de Valiente 3630",
    commune: "Vitacura"
  }

  const uderTarification = await requestUderTarification(enhancedCartProducts, pickUpInfo, dropOffInfo);
  const traeloYaTarification = await requestTraeloYaTarification(enhancedCartProducts, pickUpInfo, dropOffInfo);
  printTarificationsInConsole(uderTarification, traeloYaTarification);

  return { uderTarification, traeloYaTarification };
}


const requestUderTarification = async (enhancedCartProducts: enhanceCartProduct[], pickUpInfo: PickUpInfo, dropOffInfo: CustomerData) => {
  try {
    const inputBody = prepareUderTarificationInput(enhancedCartProducts, pickUpInfo, dropOffInfo);
    const response = await fetch('https://recruitment.weflapp.com/tarifier/uder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-key': 'NDM6HWuxtyQ9saYqnZgbJBVrS8A7KpeXRjGv2m5c'
      },
      body: JSON.stringify(inputBody),
      agent
    });

    const uderTarification = await response.json();
    return uderTarification;

  } catch (error) {
    console.log(error + '==> en UderTarification');
  }
}

const prepareUderTarificationInput = (enhancedCartProducts: enhanceCartProduct[], pickUpInfo: PickUpInfo, dropOffInfo: CustomerData) => {
  
  const manifestItems: any[] = [];

  enhancedCartProducts.forEach(product => {
    manifestItems.push({
      "name": product.title,
      "quantity": product.quantity,
      "price": product.price,
      "dimensions": {
        "length": product.dimensions.width,
        "height": product.dimensions.height,
        "depth": product.dimensions.depth
      }
    });
  });

  const UderTarificationInput = {
    "pickup_address": pickUpInfo.address,
    "pickup_name": pickUpInfo.name,
    "pickup_phone_number": pickUpInfo.phone,

    "dropoff_address": dropOffInfo.shipping_street,
    "dropoff_name": dropOffInfo.name,
    "dropoff_phone_number": dropOffInfo.phone,

    "manifest_items": manifestItems
   }

  return UderTarificationInput;
}

const requestTraeloYaTarification = async (enhancedCartProducts: enhanceCartProduct[], pickUpInfo: PickUpInfo, dropOffInfo: CustomerData) => {
  try {
    const inputBody = prepareTraeloYaTarificationInput(enhancedCartProducts, pickUpInfo, dropOffInfo);
    const response = await fetch('https://recruitment.weflapp.com/tarifier/traelo_ya', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-key': 'MbUP6JzTNB3kC5rjwFS2neuahLE7yKvZs8HXtmqf'
      },
      body: JSON.stringify(inputBody),
      agent
    });

    const traeloYaTarification = await response.json();
    return traeloYaTarification;

  } catch (error) {
    console.log(error + '==> en TraeloYaTarification');
  }
}

const prepareTraeloYaTarificationInput = (enhancedCartProducts: enhanceCartProduct[], pickUpInfo: PickUpInfo, dropOffInfo: CustomerData) => {
  
  const items: any[] = [];

  enhancedCartProducts.forEach(product => {
    items.push({
      "quantity": product.quantity,
      "value": product.price,
      "volume": Math.floor(product.dimensions.width * product.dimensions.height * product.dimensions.depth),
    });
  });

  const TraeloYaTarificationInput = {
    "items": items,

    "waypoints": [
      {
        "type": "PICK_UP",
        "addressStreet": pickUpInfo.address,
        "city": pickUpInfo.commune,
        "phone": pickUpInfo.phone,
        "name": pickUpInfo.name
      },
      {
        "type": "DROP_OFF",
        "addressStreet": dropOffInfo.shipping_street,
        "city": dropOffInfo.commune,
        "phone": dropOffInfo.phone,
        "name": dropOffInfo.name
      }
    ]
  }

  return TraeloYaTarificationInput;
}
