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















