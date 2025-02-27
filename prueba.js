const axios = require('axios');

const url = 'https://factible.fenalcoantioquia.com/FactibleWebService/FacturacionWebService';

axios.post(url, data, { timeout: 10000 })
    .then(response => console.log(response.data))
    .catch(error => console.error('Error en autenticación:', error.message));
