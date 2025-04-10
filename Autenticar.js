import soap from 'soap';
import fs from 'fs';
import path, {dirname} from 'path';
import  { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



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



function prueba(token) {
    console.log("   Este es el token ", token);
    // var listfacturas = [18909, 18910, 18911];
    var listfacturas = [18909];
    // var listfacturas = []  ;
    // for (let index = 18800; index < 18911; index++) {

    //     listfacturas.push(index )
    // }
    
    console.log(listfacturas);
    let promises = listfacturas.map(numero => {
        // let carpeta = path.join(__dirname, 'Xmls');
        var carpeta = path.join(__dirname, 'Xmls');

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
                    const archivo = path.join(carpeta, numero.toString());

                    if (err) {
                        console.error(`Error al obtener ApplicationResponseyAttachedDocument2 para la factura ${numero}:`, err);
                        return reject(err);
                    }

                    try {
                        const response = JSON.parse(result.return);
                        // console.log(`Factura ${numero} - XML en base 64:`, response.data.attachedDocument);
                        // console.log(`Factura ${numero} - XML en base 64:`, response.data.attachedDocument);
                        let base64 = response.data.attachedDocument;
                        let buffer = Buffer.from(base64, 'base64');
                        let xmlcontenido = buffer.toString('utf8');
                        // console.log(xmlcontenido);
                        if(!fs.existsSync(carpeta)){
                            fs.mkdirSync(carpeta, { recursive: true});
                        }
                        
                        fs.writeFileSync(archivo, xmlcontenido, 'utf8');
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



