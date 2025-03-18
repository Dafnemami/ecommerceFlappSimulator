'use client';

import styles from "@/styles/pages/home.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';

export default function Home() {

  const router = useRouter();

  const [cart, setCart] = useState({'cart': 'empty'});

  useEffect(() => {
    const storedData = localStorage.getItem("cart");
    if (storedData) {
      setCart(JSON.parse(storedData));
      console.log('Datos cargados CART desde localStorage');
    } 
  }, []);

  const handleGenerateCart = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/cart', { method: 'GET' })
      const data = await response.json();
      setCart(data); 
      localStorage.setItem('cart', JSON.stringify(data));

    } catch (err) {
      console.log(err + '==> en landing');
    }
  };

  const handleFinishPurchase = () => {
    if (isCartEmpty()) {
      alert('Tu carrito esta vacío');
    } else {
      router.push('/checkout');
    }
  };

  const isCartEmpty = () => {
    return cart.cart === 'empty';
  }

  return (
    <div className={styles.page}>

      Testeando

      <button className={styles.button} onClick={handleGenerateCart}> 
        Generar carrito
      </button>
      
      <button className={styles.button} onClick={handleFinishPurchase}>
        Finalizar compra 
      </button>
      
    </div>
  );
}
