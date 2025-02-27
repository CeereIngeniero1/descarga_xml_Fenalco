import soap from 'soap';

const wsdlUrl = 'https://factible.fenalcoantioquia.com/FactibleWebService/FacturacionWebService?wsdl';
var Token ;
const loginData = {
    login: 'odontosurws', // Reemplaza con tu usuario real
    password: 'Qazplm1234**' // Reemplaza con tu contraseña real
};

soap.createClient(wsdlUrl, (err, client) => {
    if (err) {
        console.error('Error al crear el cliente SOAP:', err);
        return;
    }
    
    client.setEndpoint('https://factible.fenalcoantioquia.com/FactibleWebService/FacturacionWebService');
    
    client.autenticar(loginData, (err, result) => {
        if (err) {
            console.error('Error al autenticar:', err);
            return;
        }
        
        try {
            const response = JSON.parse(result.return);
            console.log('Token de autenticación:', response.data.salida );
            Token = response.data.salida;
            prueba( response.data.salida);
        } catch (parseError) {
            console.error('Error al parsear la respuesta:', parseError);
        }
    });

    
});

// function prueba (token){
//     console.log("   Este es el token ", token);
// var listfacturas = [18909,18910, 18911];
// let Parametros = {
//     token: token,  
//     idnumeracion: 6974,  
//     numero: listfacturas
// };

//     soap.createClient(wsdlUrl, (err, client) => {
//         if (err) {
//             console.error('Error al crear el cliente SOAP:', err);
//             return;
//         }
        
//         client.setEndpoint('https://factible.fenalcoantioquia.com/FactibleWebService/FacturacionWebService');
        
//         client.obtenerApplicationResponseyAttachedDocument2(Parametros, (err, result) => {
//             if (err) {
//                 console.error('Error al obtenerApplicationResponseyAttachedDocument2:', err);
//                 return;
//             }
            
//             try {
//                 const response = JSON.parse(result.return);
//                 console.log('El xml en base 64 es : ', response.data.attachedDocument );
                
//             } catch (parseError) {
//                 console.error('Error al parsear la respuesta:', parseError);
//             }
//         });
    
        
//     });


// }

function prueba(token) {
    console.log("   Este es el token ", token);
    var listfacturas = [18909, 18910, 18911];
    // var listfacturas = []  ;
    // for (let index = 18800; index < 18911; index++) {

    //     listfacturas.push(index )
    // }
    
    console.log(listfacturas);
    let promises = listfacturas.map(numero => {
        let Parametros = {
            token: token,  
            idnumeracion: 6974,  
            numero: numero 
        };

        return new Promise((resolve, reject) => {
            soap.createClient(wsdlUrl, (err, client) => {
                if (err) {
                    console.error(`Error al crear el cliente SOAP para la factura ${numero}:`, err);
                    return reject(err);
                }

                client.setEndpoint('https://factible.fenalcoantioquia.com/FactibleWebService/FacturacionWebService');

                client.obtenerApplicationResponseyAttachedDocument2(Parametros, (err, result) => {
                    if (err) {
                        console.error(`Error al obtener ApplicationResponseyAttachedDocument2 para la factura ${numero}:`, err);
                        return reject(err);
                    }

                    try {
                        const response = JSON.parse(result.return);
                        console.log(`Factura ${numero} - XML en base 64:`, response.data.attachedDocument);
                        resolve(response.data.attachedDocument);
                    } catch (parseError) {
                        console.error(`Error al parsear la respuesta de la factura ${numero}:`, parseError);
                        reject(parseError);
                    }
                });
            });
        });
    });

    Promise.all(promises)
        .then(() => console.log("Todas las facturas han sido procesadas exitosamente."))
        .catch(err => console.error("Error procesando las facturas:", err));
}



