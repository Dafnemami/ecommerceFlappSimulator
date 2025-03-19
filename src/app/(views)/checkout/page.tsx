'use client';

import styles from "@/styles/pages/checkout.module.css";
import { useRouter } from "next/navigation";
import CartSummary from "@/componets/cartSummary";
import { combineCartAndUserData } from "@/app/(views)/checkout/utils";
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

  const handleCalculateShipping = async () => {

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
        console.log(error + '==> en handleCalculateShipping');
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
    alert('Carrito limpiado. Volverás a la página principal');
  };

  return (
    <div className={styles.page}>
      <div className={styles.title}>Checkout</div>

      <CartSummary products={cartData} />

      <button className={styles.button} onClick={() => router.push('/customer-data')}>
        Ingresa tus datos
      </button>

      <button className={styles.button} onClick={handleCalculateShipping}> 
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