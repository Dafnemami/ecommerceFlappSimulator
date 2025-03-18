'use client';

import styles from "@/styles/pages/checkout.module.css";
import { useRouter } from "next/navigation";
import CartSummary from "@/componets/cartSummary";
import { combineCartAndUserData } from "@/app/checkout/utils";
import { useEffect, useState } from "react";

type ShippingResponse = {
  courier: string;
  price: number;
}

export default function Checkout() {

  const router = useRouter();

  const [cartAndUserData, setCartAndUserData] = useState({});
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    // Necesita ejecutarte despúes que DOM esté listo
    const storedCartData = localStorage.getItem("cart");
    if (storedCartData) {
      setCartData(JSON.parse(storedCartData));
    }
  }, []);

  useEffect(() => {
    const storedCartAndUserData = combineCartAndUserData();
    if (storedCartAndUserData) {
      setCartAndUserData(JSON.parse(storedCartAndUserData));
    }
  }, []);

  const alertShippingInfoIsMissing = () => {
    alert('Debes ingresar tus datos primero');
  }

  const handleCalcuateShipping = async () => {

    if (cartAndUserData) {
      try {
        const response  = await fetch('http://localhost:3000/api/cart', { 
          method : 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cartAndUserData) 
        });
        const data = await response.json();
        console.log(data);

        handleShippingResponse(data);
      } 
      catch (error) {
        console.log(error + '==> en handleCalcuateShipping');
      }
    }
    else {
      alertShippingInfoIsMissing();
    }
  }

  const handleShippingResponse = (shippingResponse: ShippingResponse) => {
    localStorage.setItem('shipping', JSON.stringify(shippingResponse));
    router.push('/shipping-results');
  }

  const handleClearCart = () => {
    localStorage.removeItem("cart");
    router.push('/');
    // alert('Carrito limpiado');
  };

  return (
    <div className={styles.page}>
      <h1>Checkout</h1>

      <CartSummary products={cartData} />

      <button className={styles.button} onClick={() => router.push('/customer-data')}>
        Ingresa tus datos
      </button>

      <button className={styles.button} onClick={handleCalcuateShipping}> 
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