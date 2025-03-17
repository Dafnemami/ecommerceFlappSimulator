'use client';

import styles from "@/styles/pages/checkout.module.css";
import { useRouter } from "next/navigation";
import CartSummary from "@/componets/cartSummary";

export default function Checkout() {

  const router = useRouter();

  const storedCartData = localStorage.getItem("cart");
  const products = storedCartData ? JSON.parse(storedCartData) : [];
  console.log(products);
  console.log('checkout');


  const handleClearCart = () => {
    localStorage.removeItem("cart");
    router.push('/');
    // alert('Carrito limpiado');
  };

  return (
    <div className={styles.page}>
      <h1>Checkout</h1>

      <CartSummary products={products} />

      <button className={styles.button} onClick={() => router.push('/customer-data')}>
        Ingresa tus datos
      </button>

      <button className={styles.button} > 
        Cotizar despacho
      </button>
      
      <button className={styles.button} onClick={handleClearCart} >
        Limpiar carrito
      </button>

      <button className={styles.button} onClick={() => router.push('/')}>
        Volver
      </button>
    </div>
  );
}



