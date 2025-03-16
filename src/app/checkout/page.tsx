import styles from "@/styles/pages/checkout.module.css";

export default function Checkout() {
  return (
    // P. resumen de compra
    <div className={styles.page}>
      <h1>Checkout</h1>

      <button className={styles.button} > 
        Cotizar despacho
      </button>
      
      <button className={styles.button} >
        Limpiar carrito
      </button>

      <button className={styles.button} >
        Volver
      </button>
    </div>
  );
}



