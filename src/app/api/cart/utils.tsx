
interface Cart {
  products: Array<{
    id: number,
    price: number,
    quantity: number,
    discountPercentage: number,
  }>;
  userId: number;
}

export const formatCart = async (cart: Cart) => {

  // Solo si no se ha generdo otro carrito antes ??

  const cartProducts = cart.products;

  const formattedCart = cartProducts.map((product) => {
    return { 
      'productId': product.id,
      'price': product.price,
      'quantity': product.quantity,
      'discount': Math.floor(product.discountPercentage * product.price)
      }
    }
  ); 

  return formattedCart;
}