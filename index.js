
//Paquete que me permite usar variables de entorno, en este caso poder usar el MAPBOX KEY
require ('dotenv').config()

const axios = require('axios');

const {leerInput, inquirerMenu, pausa, listadoSeleccion} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');


const  main = async () => {

    console.clear();

    //Se pone por fuera del do para que no se inicialice cada vez que se vuelve a ejecutar el menu 
    const busquedas = new Busquedas();

    let opt;

    do {
        opt = await inquirerMenu ();

        switch (opt){

            case 1:
            //Mostrar mensaje   
            const terminoBusqueda = await leerInput('Escriba la ciudad de la cual desea saber información: ');
            
            //Buscar los lugares
            const listadoLugares = await busquedas.ciudad(terminoBusqueda);

            //seleccionar el lugar 
            const idlugarSeleccionado = await listadoSeleccion(listadoLugares);

            //Esto se hace por si el usuario cancela la opcion volver al menu principal
            //tambien se puede poner 
            //if (idlugarSeleccionado === 0 ) continue; 
            //Lo que quiere decir que si idlugarSeleccionado es igual a 0 se corta el proceso y vuelve a inquirerMenu
            //en pocas palabras se sale del switch, pero en este caso utilizamos lo siguiente que significa lo mismo
            if(idlugarSeleccionado!==0){

                
                //La funcion .find me permite hacer un recorrido por listadoLugares y extraer el objeto
                //con todas sus propiedades, si y solo si, l.id (recorrido) coincide con el idlugarSeleccionado
                const lugarSeleccionado = listadoLugares.find( l => l.id===idlugarSeleccionado)
                
                //Guardar en DB
                //como es asincrono no necesito el await, no me interesa ver si se ejecuto
                busquedas.agregarHistorial(lugarSeleccionado.nombre); 

                //datos del clima
                const datosClima = await busquedas.openWeather(lugarSeleccionado.lat, lugarSeleccionado.lng);

                
                //Mostrar resultados
                console.log('\n============================='.green);
                console.log('Informacion de la ciudad'.green);
                console.log('============================='.green);
                console.log('Ciudad: ', lugarSeleccionado.nombre);
                console.log('Lat: ', lugarSeleccionado.lat);
                console.log('Lng: ', lugarSeleccionado.lng);
                console.log('Temperatura: ', datosClima.temp);
                console.log('Mínima: ', datosClima.min);
                console.log('Máxima: ', datosClima.max);
                console.log('¿Cómo esta el clima?: ', datosClima.desc);

            }

            break;


            case 2: 

            // //Mostrar historial
            busquedas.historialCapitalizado.forEach( (lugar, i) => {
                
                const indice = `${i+1}.`.green;

                console.log(`${indice} ${lugar}`);
            })
            
            break;

        }

        if (opt!==0){

            await pausa();
        }
    }

    //Este while sirve para repetir el do a menos que opt sea igual a 0, en ese caso se termina la aplicacion
    while (opt!==0);
}

main();
