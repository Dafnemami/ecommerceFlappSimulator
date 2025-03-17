
// Join json userData & cart
export const combineCartAndUserData = () => {
  const cart = localStorage.getItem('cart');
  const userData = localStorage.getItem('userData');
  if (cart && userData) {
    const combinedData = JSON.stringify({ products: JSON.parse(cart), customer_data: JSON.parse(userData) });
    localStorage.setItem('cartAndUserData', combinedData);
    return combinedData;
  }
  return null;
}