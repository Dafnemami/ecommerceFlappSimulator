import React from "react";
import styles from "./cartSummary.module.css";


type Product = {
  productId: number;
  price: number;
  quantity: number;
  discount: number;
};


const CartSummary: any = ({ products }) => {
  if (products.length === 0) {
    return <p className={styles.emptyCart}>Tu carrito está vacío 🛒</p>;
  }

  const calculateTotalPerProduct = (product: Product) => {
    return product.price * product.quantity;
  };

  const calculateTotalPerProductWithDiscounts = (product: Product) => {
    const discount = product.discount || 0; 
    return (product.price - discount) * product.quantity;
  };

  const subtotal = products.reduce((sum: number, product: Product) => sum + calculateTotalPerProduct(product), 0);
  const total = products.reduce((sum: number, product: Product) => sum + calculateTotalPerProductWithDiscounts(product), 0);

  return (
    <div className={styles.cartContainer}>
      <h2 className={styles.title}>Resumen del Carrito 🛍️</h2>
      <ul className={styles.productList}>
        {products.map((product: Product) => (
          <li key={product.productId} className={styles.productItem}>
            <span className={styles.productName}>Producto {product.productId}</span>
            <span className={styles.price}>${product.price} c/u</span>
            <span className={styles.quantity}>x{product.quantity}</span>
            {product.discount != 0 ? (
              <span className={styles.discount}>Descuento: ${product.discount}</span>
            ) : (
              <span className={styles.noDiscount}>Sin descuento</span>
            )}
            <span className={styles.total}>Total: ${calculateTotalPerProductWithDiscounts(product).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className={styles.summary}>
        <p className={styles.subtotal}>Subtotal: ${subtotal.toFixed(2)}</p>
        <p className={styles.totalAmount}>Total: ${total.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default CartSummary;
