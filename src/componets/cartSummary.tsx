import React from "react";
import styles from "./cartSummary.module.css";


type Product = {
  productId: number;
  price: number;
  quantity: number;
  discount: number;
};


const CartSummary: any = ({ products }) => {
  const calculateTotalPerProduct = (product: Product) => product.price * product.quantity;
  const calculateTotalPerProductWithDiscounts = (product: Product) => (product.price - (product.discount || 0)) * product.quantity;

  const subtotal = products.reduce((sum: number, product: Product) => sum + calculateTotalPerProduct(product), 0);
  const total = products.reduce((sum: number, product: Product) => sum + calculateTotalPerProductWithDiscounts(product), 0);

  return (
    <div className={styles.cartContainer}>
      <h2 className={styles.title}>Resumen del Carrito 🛍️</h2>
      
      <div className={styles.productList}>
        <div className={styles.productHeader}>
          <span>Producto</span>
          <span>Precio</span>
          <span>Cantidad</span>
          <span>Descuento</span>
          <span>Total</span>
        </div>

        {products.map((product: Product) => (
          <div key={product.productId} className={styles.productItem}>
            <span className={styles.productName}>Producto {product.productId}</span>
            <span className={styles.price}>${product.price}</span>
            <span className={styles.quantity}>{product.quantity}</span>
            <span className={styles.discount}>
              {product.discount ? `$${product.discount}` : "-"}
            </span>
            <span className={styles.total}>
              ${calculateTotalPerProductWithDiscounts(product).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <p className={styles.subtotal}>Subtotal: ${subtotal.toFixed(2)}</p>
        <p className={styles.totalAmount}>Total: ${total.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default CartSummary;

