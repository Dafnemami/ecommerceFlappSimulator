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

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
      console.log('Datos cargados USER-DATA desde localStorage');
    } 
  }, []);

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

      localStorage.setItem('userData', JSON.stringify(userData));
      
    } catch (error) {
      console.error('Error:', error + '==> front - customerData');
    }
  };

  const raiseFormAlerts = () => {
    const errors = validateForm();
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return true;
    }
    return false;
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

  const isAnyFieldEmpty = () => {
    return Object.values(userData).some(value => value === '');
  };

  const isnameValid = () => {
    return !userData.name.match(/[\d]/) && userData.name.split(' ').length >= 2;
  }

  const isAddressValid = () => {
    return userData.shipping_street.match(/\d/) && userData.shipping_street.match(/\w/);
  }
  
  const isCommuneValid = () => {
    return !userData.commune.match(/\d/);
  }
  
  const isPhoneValid = () => {
    const isPhoneLengthValid = userData.phone.length === 12;
    const isPhonePrefixValid = userData.phone.startsWith('+569');
    return isPhoneLengthValid && isPhonePrefixValid;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData({
      ...userData,
      [name]: value
    });
    console.log(userData);
  };

  return (
    <div className={styles.page}>
      <div className={styles.title}>Ingresa los datos de envío</div>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
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