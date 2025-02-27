import soap from 'soap';


const wsdlUrl = 'https://factible.fenalcoantioquia.com/FactibleWebService/FacturacionWebService?wsdl';

soap.createClient(wsdlUrl, (err, client) => {
    if (err) {
        console.error('Error al crear el cliente SOAP:', err);
        return;
    }

    const methods = client.describe();

    // console.log('Métodos disponibles obtenerApplicationResponseyAttachedDocument:', methods.FacturacionWebService.FacturacionWebServicePort.obtenerApplicationResponseyAttachedDocument);
    console.log('Métodos disponibles obtenerApplicationResponseyAttachedDocument2:', methods.FacturacionWebService.FacturacionWebServicePort.obtenerApplicationResponseyAttachedDocument2);
    // console.log('Métodos disponibles obtenerApplicationResponseyAttachedDocument3:', methods.FacturacionWebService.FacturacionWebServicePort.obtenerApplicationResponseyAttachedDocument3);
    // console.log('Métodos disponibles obtenerApplicationResponseyAttachedDocument:', methods.FacturacionWebService.FacturacionWebServicePort.obtenerApplicationResponseyAttachedDocument);
    // console.log('Métodos disponibles:', methods.FacturacionWebService.FacturacionWebServicePort.obtenerApplicationResponseyAttachedDocument);
});
