
//filesystem
const fs = require('fs');

//Paquete que me permite hacer llamados http a servicios de terceros que pueda necesitar 
const axios = require('axios');

class Busquedas {

    historial = [];

    dbPath = './db/database.json'

    constructor(){

        //TODO: leer DB si existe 
        this.leerDB();
        
    }

    get historialCapitalizado(){

        //Capitalizar historial
        return this.historial.map(lugar =>{

            //crear un arreglo con las palabras dividas del lugar mediante la separacion de un espacio ' '
            let palabras = lugar.split(' ');

            //A esas palabras divididas haciendo un recorrido map de les modifica la primera letra por una
            //mayuscula y se conmpleta con el resto mediante la fincion .substring
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            //Retorno las palabras nuevamente unidas mediante un espacio y eso se hace por cada lugar
            return palabras.join(' ');
        })
    }


    //objeto que siempre va a tener las mismas propiedades y que puedo llamar dentro del modelo para que el codigo
    //sea mas ordenado 
    get paramsMapbox() {

        return {
            
            //Complementos del enlace 
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'

        }
    }

    get paramsOpenWeather() {

        return {

            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'

        }
    }

    async ciudad (lugar='') {


        try {
            //TODO Peticion http
            
            //Crear una instancia para para dividir las partes del enlance y pueda haber una interaccion con
            // la infomacion que ingresa el usuario.
            const instance = axios.create({

                //baseURL y params son parametros propios de la funcion axios.create
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,

                //Complementos del enlace que estoy llamando de un get para que el codigo sea mas limpio
                params: this.paramsMapbox
            });


            //Da el arreglo con todas las propiedades de la busqueda 
            const resp = await instance.get();

            //.data para que solo me arroje la informacion que necesito
            // console.log(resp.data);

            //esto solo es un ejemplo para llamar una url en especifico pero se utiliza mejor el axios.create para
            //cuando se necesita modificar algo de la URL
            //llamado de axios a un sitio web que me emite una respuesta, axios trabaja basado en promesas
            // const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/Madrid.json?access_token=pk.eyJ1Ijoic2YtZ3VhcmluIiwiYSI6ImNrbXIxaWpzbjAzajMyb25rNXFubjFvd3EifQ.80iff8cCwlbN2bdDCEmLMA&limit=5&language=es');

            //resp.data.features es el arreglo que tiene mi informacion de interes de los 5 lugares para buscar
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            })) //Retorna el arreglo de lugares con las propiedades que me interesan
            
        } catch (error) {
            
            return [];
        }
    }

    async openWeather(lat, lon) {

        try {

            const instance = axios.create({
    
                //baseURL y params son parametros propios de la funcion axios.create
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
    
                //Complementos del enlace que estoy llamando de un get para que el codigo sea mas limpio
                params: this.paramsOpenWeather
    
            });
    
            const resp = await instance.get();

            return {
                desc: resp.data.weather[0].description,
                temp: resp.data.main.temp,
                max: resp.data.main.temp_max,
                min: resp.data.main.temp_max
            }
            
        } catch (error) {
            
            console.log('no se imprimio la ciudad');
        }

            
    }

    agregarHistorial(lugar=''){

        //TODO Prevenir duplicados
        //Aca quiere decir que si el lugar ya existe en el historial 
        //retorna nada (literal) y ya no sigue con el proceso. Ademas se utiliza .toLocaleLowerCase para
        //pasar todo a minusculas y no haya confusion al diferenciar minusculas de mayusculas
        if( this.historial.includes(lugar.toLocaleLowerCase() ) ){
            return;
        }

        //Grabar nombres de busqueda en el arreglo
        this.historial.unshift( lugar.toLocaleLowerCase() );


        //Para limitar el arreglo de historial (que no tenga mas de 5 objetos)
        if(this.historial.length>4){
            //metodo para eliminar un objeto de un arreglo (el 5 es la posicion y 1 es para eliminar, 0 se 
            //utiliza para remplazar por otro objero pero este no es el caso)
            this.historial.splice(5,1);
        }

        //Grabar en DB
        this.guardarDB()
    }

    //metodo paraguardar la informacion 
    guardarDB() {

        //Crear un objeto con el fin de tener diferentes propiedades si quisiera guardar otros datos como 
        //por ejemplo historial de temperaturas u otras cosas, pero en este caso solo voy a poner la propiedad
        // de historial 
        const payload = {
            historial: this.historial
        };


        //guardar la informacion en formato JSON
        fs.writeFileSync( this.dbPath, JSON.stringify(payload));

    }

    leerDB() {

        //Existe el archivo?
        if (!fs.existsSync(this.dbPath)){

            return;
        } 


        //Si existe leer la info
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });

        //Convertir el string en un arreglo
        const data = JSON.parse(info);

        this.historial = data.historial;

    }
     
}


module.exports = Busquedas;