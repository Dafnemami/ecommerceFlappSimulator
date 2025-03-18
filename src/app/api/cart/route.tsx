import { NextRequest, NextResponse } from 'next/server';
import { formatCart } from './utils';
import agent from './httpsAgent';
import fetch from 'node-fetch'; // Importar node-fetch en lugar del fetch nativo

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
    const productsAndShippingInfo = await request.json();
    // console.log(productsAndShippingInfo);
  
    // Esto debería estar contenido en otra función
    const cartProducts = productsAndShippingInfo.products;
    const allProducts = await fetchAllProducts();
    const enhancedCartProducts = mergeCartWithProductDetails(cartProducts, allProducts);
    printEnhanceCartInConsole(enhancedCartProducts);

    if (!canStockBeSatisfied(enhancedCartProducts)) {
      // P. indicar que productos no tienen stock suficiente
      return NextResponse.json({ message: 'No hay stock suficiente para satisfacer la orden' }, { status: 400 });
    }

    // tarificación a los couriers
    await couriersTarification(enhancedCartProducts, productsAndShippingInfo.customer_data);


    return NextResponse.json({ message: 'Orden recibida X' });
  } catch (error) {
    return NextResponse.json({ message: `Error al recibir la orden ${error}` }, { status: 500 });
  }
}


// SACAR ESTE CÓDIGO DE ACÁ ??
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


type cartProduct = {
  productId: number;
  price: number;
  quantity: number;
  discount: number;
}

type dataBaseProduct = {
  id: number;
  title: string;
  rating: number;
  stock: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  }
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


type enhanceCartProduct = {
  id: number;
  price: number;
  quantity: number;
  discount: number;
  title: string;
  rating: number;
  stock: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  }
  realStock: number;
}


const printEnhanceCartInConsole = (enhancedCartProducts: enhanceCartProduct[]) => {
  console.log("Carro Recibido es el siguente:");
  console.table(enhancedCartProducts.map(product => ({
    "ID": product.id,
    "Nombre": product.title,
    "Precio por unidad ($)": product.price,
    "Descuento total ($)": product.discount * product.quantity,
    "Cantidad solicitada": product.quantity,
    "Stock obtenido": product.stock,
    "Rating": product.rating,
    "Stock real": product.realStock
  })));
}

const canStockBeSatisfied = (enhancedCartProducts: enhanceCartProduct[]) => {
  return enhancedCartProducts.every(product => product.realStock >= product.quantity);
}


const couriersTarification = async (enhancedCartProducts: enhanceCartProduct[], dropOffInfo: CustomerData) => {

  const pickUpInfo = {
    name: "Tienda Flapp",
    phone: "+56912345678",
    address: "Juan de Valiente 3630",
    commune: "Vitacura"
  }

  await requestUderTarification(enhancedCartProducts, pickUpInfo, dropOffInfo);

  // P. X-Api-key deberían ir en un .env  !!
  // TráeloYa: MbUP6JzTNB3kC5rjwFS2neuahLE7yKvZs8HXtmqf

}

type PickUpInfo = {
  name: string;
  phone: string;
  address: string;
  commune: string;
};

type CustomerData = {
  name: string;
  shipping_street: string;
  commune: string;
  phone: string;
}

const requestUderTarification = async (enhancedCartProducts: enhanceCartProduct[], pickUpInfo: PickUpInfo, dropOffInfo: CustomerData) => {
  try {
    const inputBody = prepareUderTarificationInput(enhancedCartProducts, pickUpInfo, dropOffInfo);
    console.log(JSON.stringify(inputBody));
    const response = await fetch('https://recruitment.weflapp.com/tarifier/uder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-key': 'NDM6HWuxtyQ9saYqnZgbJBVrS8A7KpeXRjGv2m5c'
      },
      body: JSON.stringify(inputBody),
      agent
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

  } catch (error) {
    console.log(error + '==> en UderTarification');
    console.error('Mensaje:', error.message);
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

  //  console.log(UderTarificationInput);

  return UderTarificationInput;
}



// const printTarificationInConsole = () => {















