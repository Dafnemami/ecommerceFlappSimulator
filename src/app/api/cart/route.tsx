import { NextRequest, NextResponse } from 'next/server';
import { formatCart } from './utils';

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


    return NextResponse.json({ message: 'Orden recibida X' });
  } catch (error) {
    return NextResponse.json({ message: `Error al recibir la orden ${error}` }, { status: 500 });
  }
}


// SACAR ESTE CÓDIGO DE ACÁ ??
const fetchAllProducts = async () => {
  
  const allProducts = [];
  let skip = 0; // usando paginación de 10 en 10
  const atributesToSelect = 'id,title,rating,stock';

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
      realStock: realStock
    };
  });

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
  

  return enhancedCartProducts;
}


















