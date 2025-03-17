'use client';

import styles from "@/styles/pages/home.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';

export default function Home() {

  const router = useRouter();

  const [cart, setCart] = useState({'cart': 'empty'});

  const handleGenerateCart = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/cart', { method: 'GET' })
      const data = await response.json();
      setCart(data); 
      
      // Persisten los datos incluso después de cerrar y volver a abrir el navegador
      localStorage.setItem('cart', JSON.stringify(data));

    } catch (err) {
      console.log(err + '==> en landing');
    }
  };

  useEffect(() => {
    // Si los datos ya están en localStorage, los cargamos
    const storedData = localStorage.getItem("cart");
    if (storedData) {
      setCart(JSON.parse(storedData));
      console.log('Datos cargados CART desde localStorage');
    } 
  }, []);

  const isCartEmpty = () => {
    return cart.cart === 'empty';
  }

  const handleFinishPurchase = () => {
    if (isCartEmpty()) {
      alert('Tu carrito esta vacío');
    } else {
      router.push('/checkout');
    }
  };


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
