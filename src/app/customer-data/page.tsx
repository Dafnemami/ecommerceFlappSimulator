'use client'; 

import styles from "@/styles/pages/customerData.module.css";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function CustomerData() {

  const router = useRouter();

  const [userData, setUserData] = useState({
    name: "",
    shipping_street: "",
    commune: "",
    phone: ""
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData({
      ...userData,
      [name]: value // actualiza solo el campo que cambió
    });
    console.log(userData);
  };

  const isAnyFieldEmpty = () => {
    return Object.values(userData).some(value => value === '');
  };

  const isnameValid = () => {
    // no tiene números y tiene al menos 2 palabras
    return !userData.name.match(/[\d]/) && userData.name.split(' ').length >= 2;
  }

  const isAddressValid = () => {
    // tiene números y letras
    return userData.shipping_street.match(/\d/) && userData.shipping_street.match(/\w/);
  }
  
  const isCommuneValid = () => {
    // no tiene números
    return !userData.commune.match(/\d/);
  }
  
  const isPhoneValid = () => {
    const isPhoneLengthValid = userData.phone.length === 12;
    const isPhonePrefixValid = userData.phone.startsWith('+569');
    return isPhoneLengthValid && isPhonePrefixValid;
  }

  const validateForm = () => {

    const errors = [];

    if (isAnyFieldEmpty()) 
      errors.push('Completa todos los campos');
    if (!isnameValid()) 
      errors.push('Nombre inválido');
    if (!isAddressValid())
      errors.push('Dirección incompleta'); 
    if (!isCommuneValid())
      errors.push('Comuna inválida');
    if (!isPhoneValid())
      errors.push('Teléfono inválido');

    return errors;
  }

  const raiseFormAlerts = () => {
    const errors = validateForm();
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return true;
    }
    return false;
  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 

    if (raiseFormAlerts()) {
      return;
    }

    try { 
      const response = await fetch("/api/customer-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      console.log(data);
      console.log(userData);

       // Persisten los datos incluso después de cerrar y volver a abrir el navegador
      localStorage.setItem('userData', JSON.stringify(userData));
      
    } catch (error) {
      console.error('Error:', error + '==> front - customerData');
    }
  };

  useEffect(() => {
    // Si los datos ya están en localStorage, los cargamos
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
      console.log('Datos cargados USER-DATA desde localStorage');
    } 
  }, []);

  return (
    <div className={styles.page}>
      <h1>CustomerData</h1>
      <form onSubmit={handleSubmit}>
        <label>Nombre Completo</label>
        <input type="text" name="name" onChange={handleChange} />
        <label>Dirección</label>
        <input type="text" name="shipping_street" onChange={handleChange}/>
        <label>Comuna</label>
        <input type="text" name="commune" onChange={handleChange}/>
        <label>Teléfono</label>
        <input type="text" name="phone" onChange={handleChange} placeholder="+569"/>  
        <input type="submit" value="Enviar"/>
      </form>

      <button className={styles.button} onClick={() => router.push('/checkout')}>
        Volver
      </button>
    </div>
  );
}