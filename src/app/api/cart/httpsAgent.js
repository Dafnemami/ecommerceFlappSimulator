import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false, // Desactivar validación de certificados SSL
});

export default agent;
