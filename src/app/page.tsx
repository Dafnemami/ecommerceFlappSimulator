'use client';

import styles from "@/styles/pages/home.module.css";
import { useState } from 'react';

export default function Home() {

  const [cart, setCart] = useState({'cart': 'empty'});

  const handleGenerateCart = () => {
    fetch('http://localhost:3000/api/cart', { method: 'GET' })
    .then(res => res.json())
    .then(data => { setCart(data); console.log(data); })
    .catch(err => console.log(err + '==> en landing'));
  }

  // const handleFinishPurchase = () => {
  //   fetch('https://dummyjson.com/carts/40')
  //   .then(res => res.json())
  //   .then(console.log);
  // }

  return (
    <div className={styles.page}>

      Testeando

      <button className={styles.button} onClick={handleGenerateCart}> 
          Generar carrito 
      </button>
{/*       
      <button className={styles.button} onClick={handleFinishPurchase}>
        Finalizar compra 
      </button> */}
      
    </div>
  );
}
