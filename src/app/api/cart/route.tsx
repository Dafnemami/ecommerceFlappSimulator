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
    const data = await request.json();
    console.log(data);

    fetchAllProducts(data.products);

    return NextResponse.json({ message: 'Orden recibida' });
  } catch (error) {
    return NextResponse.json({ message: `Error al recibir la orden ${error}` }, { status: 500 });
  }
}

type Product = {
  productId: number;
  price: number;
  quantity: number;
  discount: number;
}


const fetchAllProducts = async () => {
  // trae todos los productos usando paginación de 10 en 10
  const allProducts = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) { // P. revisar!!
    try {
      const response = await fetch(`https://dummyjson.com/products?page=${page}`);
      const data = await response.json();
      allProducts.push(data.products);
      totalPages = data.totalPages;
      page++;
    } catch (error) {
      console.log(error + '==> en fetchAllProducts');
    }
  }

  return allProducts;

}


const filterCartProducts = ( product: Product[] ) => {

  const cartProducts = [];
  const allProducts = fetchAllProducts();
  
  product.forEach((prod) => {
    const product = allProducts.find((p) => p.id === prod.productId);
    cartProducts.push(product);
  });















