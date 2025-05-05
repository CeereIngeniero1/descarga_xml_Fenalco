// import soap from 'soap';
// import fs from 'fs';
// import path, {dirname} from 'path';
// import  { fileURLToPath } from 'url';

const soap = require('soap');
const fs = require('fs');
const path = require('path');
// const fileURLToPath = require('url').fileURLToPath;


// console.log(__filename);
// console.log(__dirname);
// // const __filename = path.fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);



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
    var listfacturas = [18909,18910,18911,18912,18913,18914,18915,18916,18917,18918,18919,18920,18921,18922,18923,18924,18925,18926,18927,18928,18929,18930,18931,18932,18933,18934,18935,18936,18937,18938,18939,18940,18941,18942,18943,18944,18945,18946,18947,18948,18949,18950,18951,18952,18953,18954,18955,18956,18957,18958,18959,18960,18961,18962,18963,18964,18965,18966,18967,18968,18969,18970,18971,18972,18973,18974,18975,18976,18977,18978,18979,18980,18981,18982,18983,18984,18985,18986,18987,18988,18989,18990,18991,18992,18993,18994,18995,18996,18997,18998,18999,19000,19001,19002,19003,19004,19005,19006,19007,19008,19009,19010,19011,19012,19013,19014,19015,19016,19017,19018,19019,19020,19021,19022,19023,19024,19025,19026,19027,19028,19029,19030,19031,19032,19033,19034,19035,19036,19037,19038,19039,19040,19041,19042,19043,19044,19045,19046,19047,19048,19049,19050,19051,19052,19053,19054,19055,19056,19057,19058,19059,19060,19061,19062,19063,19064,19065,19066,19067,19068,19069,19070,19071,19072,19073,19074,19075,19076,19077,19078,19079,19080,19081,19082,19083,19084,19085,19086,19087,19088,19089,19090,19091,19092,19093,19094,19095,19096,19097,19098,19099,19100,19101,19102,19103,19104,19105,19106,19107,19108,19109,19110,19111,19112,19113,19114,19115,19116,19117,19118,19119,19120,19121,19122,19123,19124,19125,19126,19127,19128,19129,19130,19131,19132,19133,19134,19135,19136,19137,19138,19139,19140,19141,19142,19143,19144,19145,19146,19147,19148];
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
                    const archivo = path.join(carpeta, `${numero.toString()}.xml` );

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



