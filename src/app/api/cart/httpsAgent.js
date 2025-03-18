// lib/httpsAgent.js
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false, // Desactiva la validación de certificados
});

export default agent;
