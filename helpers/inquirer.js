
//Este archivo como tal tiene todos los metodos y la logica para mostrar la interfaz al usuario

const inquirer = require('inquirer');
require('colors');


const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                //valor que le doy si escogen la opción
                value: 1,
                //String que se le muestro al usuario para que seleccione la opción 
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            },
    ]

    }
]

const preguntaPausa = [
    {
        type: 'input',
        name: 'pausaOpcion',
        message: `\n Presione ${'ENTER'.green} para continuar`
    }
]



const  inquirerMenu = async() => {

    console.clear();

    console.log('============================'.green);
    console.log('   Seleccione una opción'.white);
    console.log('============================\n'.green);

    //Se utiliza los {} para sacar el valor de esa opcion 
    const  {opcion}  = await inquirer.prompt(preguntas);

    return opcion;
}

//tarea de pausa
const pausa = async() => {

    console.log('\n');

    await inquirer.prompt(preguntaPausa);
}


const leerInput = async(message) => {

    console.log('\n');

    const preguntaCrearTarea = [
        {
            type: 'input',
            name: 'descripcion',
            message,
    
            //Para validar que el usuario si ingreso algo para la creacion de la tarea
            //value es cualquier valor que haya ingresado el usuario 
            validate(value){
                if(value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                //retornar true en caso de que el usuario si haya ingresado algo para seguir con la aplicacion 
                return true;
            }
        }
    ]

    //Recordar siempre hacer la destructuracion 
    const {descripcion} = await inquirer.prompt(preguntaCrearTarea);

    return descripcion;
}


//metodo para borrar tareas 
const listadoSeleccion = async (lugaresParaSeleccionar=[]) => {


    //Esto es para crear mi arreglo de choices
    //El .map sirve para crear otro arreglo pero con valores que puedo modificar uno a uno segun una funcion
    const choices = lugaresParaSeleccionar.map((lugar, i)=>{

        const index = `${i+1}.`.green;

        //Aca retorno cada uno de los choices
        return {

            value: lugar.id,
            name: `${index} ${lugar.nombre}`
            
        }
    });

    choices.unshift({
        value: 0,
        name: `${'0.'.green} Cancelar`
    })

    //Aca ya como tal creo la pregunta que voy a meter al prompt con mis choices que cree anteriormente
    const preguntaSeleccion = [
        {
            type: 'list',
            name: 'id',
            message: '¿Qué lugar desea seleccionar?',
            choices
        }
    ]


    //Aca necesito poner el await ya que estoy esperando que el usuario seleccione una opcion 
    const  {id}  = await inquirer.prompt(preguntaSeleccion);
    return id;
}

//Metodo para confirmar la accion que esta realizando un usuario 
const confirmar = async (message) =>{

    const preguntaConfirmacion = [
        {
            //'Confirm' es una funcion que del metodo inquirer que permite confirmar una accion
            //retorna un true o false
            type: 'confirm',
            name: 'ok',
            message
        }
    ]


    const {ok} = await inquirer.prompt(preguntaConfirmacion)
    return ok;
}


//metodo para completar tareas
const listadoTareasCompletar = async (tareas=[]) => {


    //Esto es para crear mi arreglo de choices
    //El .map sirve para crear otro arreglo pero con valores que puedo modificar uno a uno segun una funcion
    const choices = tareas.map((tarea, i)=>{

        const index = `${i+1}.`.green;

        //Aca retorno cada uno de los choices
        return {

            value: tarea.id,
            name: `${index} ${tarea.descripcion}`,

            //Estado del checked de cada tarea, es decir si existe algo en completadoEn de una vez se va
            //seleccionar automaticamente en mi checklist
            checked: (tarea.completadoEn) ? true : false
            
        }
    });


    //Aca ya como tal creo la pregunta que voy a meter al prompt con mis choices que cree anteriormente
    const preguntasListadoCompletado = [
        {
            //Funcion de inquirer que permite hacer una checklist de los parametros que entran
            //checkbox devuelve un arreglo con los valores de las opciones escogidas por el usuario
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices
        }
    ]


    //Aca necesito poner el await ya que estoy esperando que el usuario seleccione una opcion 
    const  {ids}  = await inquirer.prompt(preguntasListadoCompletado);
    return ids;
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listadoSeleccion,
    confirmar,
    listadoTareasCompletar
}