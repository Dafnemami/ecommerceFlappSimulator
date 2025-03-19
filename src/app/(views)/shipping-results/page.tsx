'use client';

import styles from  "@/styles/pages/shipping-results.module.css";


export default function ShippingResults() {

  const shippingResponse = localStorage.getItem('shippingResponse');
  const shippingResponseParsed = JSON.parse(shippingResponse!);

  return (
    <div className={styles.page}>
      <div className={styles.title}>Hemos finalizado</div>
      {shippingResponseParsed.message ?
        <div className={styles.subtitle}>No hay envíos disponibles :(</div>
        :
        <div className={styles.subtitle}>Envío Flipp con {shippingResponseParsed.courier} ⚡ - ${shippingResponseParsed.price}</div>
      }
    </div>
  );
}