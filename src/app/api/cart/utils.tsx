
interface Cart {
  products: Array<{
    id: number,
    price: number,
    quantity: number,
    discountPercentage: number,
  }>;
  userId: number;
}

type UserData = {
  firstName: string,
  lastName: string,
  address: {
    address: string,
    city: string,
  },
  phone: string,
}

const formatPhoneNum = (phone: string) => {
  return phone.replace(/[\s-]/g, '');
}

const formatUserData = (userData: UserData) => {
  console.log('here at formatUserInfo');
  return {
    'name': userData.firstName + ' ' + userData.lastName,
    'shipping_street': userData.address.address,
    'commune': userData.address.city,
    'phone': formatPhoneNum(userData.phone),
  }
};

export const formatCart = async (cart: Cart) => {

  // Solo si no se ha generdo otro carrito antes ??

  const cartProducts = cart.products;
  const userId = cart.userId;

  const formattedCart = cartProducts.map((product) => {
    return { 
      'productId': product.id,
      'price': product.price,
      'quantity': product.quantity,
      'discount': Math.floor(product.discountPercentage * product.price)
      }
    }
  ); 

  // Get user data
  try {
    const response = await fetch(`https://dummyjson.com/users/${userId}`)
    const userData = await response.json();
    const formattedUserData = formatUserData(userData);

    const formattedCartWithUserData = {
      'products': formattedCart,
      'customer_data': formattedUserData,
    };

    return formattedCartWithUserData;
    
  
  } catch (err) {
    console.log(err + '==> back - GET user data');
  } 

}