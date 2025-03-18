import { Cart, enhanceCartProduct } from './types';

export const formatCart = async (cart: Cart) => {
  const cartProducts = cart.products;

  const formattedCart = cartProducts.map((product) => {
    return { 
      'productId': product.id,
      'price': product.price,
      'quantity': product.quantity,
      'discount': Math.floor((product.discountPercentage / 100) * product.price)
      }
    }
  ); 

  return formattedCart;
}

export const printEnhanceCartInConsole = (enhancedCartProducts: enhanceCartProduct[]) => {
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

export const printTarificationsInConsole = (uderTarification: any, traeloYaTarification: any) => {
  console.log("Tarificaciones:");
  console.log("Uder:");
  console.log(uderTarification);
  console.log("TraeloYa:");
  console.log(traeloYaTarification);
}
