//imports
const express = require("express");
const app = express();
const cors = require('cors');
const fs = require('fs');
const parser = require('./g');

//Configuracion del servidor
app.use(express.json({
  limit: '1mb'
}));


//Objetos de uso general

let ast_resultante = {};
let reducciones_ast = {};

app.use(cors());

app.listen(3000, () => {
  console.log("El servidor está inicializado en el puerto 3000");
});

app.get('/', function (req, res) {
  res.send('201800519 Nelson Alesandro Gonzalez Perez ');
});

app.post('/ast', cors(), (request, response) => {

  //Archivo recibido del frontend
  let entrada = request.body.texto;

  //Resultado del analisis
  const astJSON = an(entrada.toString());
  ast_resultante = astJSON;
  let res = {
    status: 'correcto',
    reportes_ast: astJSON
  }
  console.log(astJSON);
  response.json(res);
});

app.get('/erroresL', cors(), (request, response) => {
  let lexicos = {};
  let sintacticos = {};
  fs.readFile('./out/errores.json', 'utf-8', (err, data) => {
    if (err) {
      let carga = {
        status: 'error'
      };
      lexicos = carga;
    } else {
      lexicos = JSON.parse(data);
      response.json(lexicos);
      /*  
       */
    }
  });
});

app.get('/erroresS', cors(), (request, response) => {
  let sintacticos = {};
  fs.readFile('./out/erroresS.json', 'utf-8', (err, data) => {
    if (err) {
      let carga = {
        status: 'error'
      };
      sintacticos = carga;
    } else {
      sintacticos = JSON.parse(data);
      response.json(sintacticos);
    }
  });
});


app.get('/copia', cors(), (request, response) => {
  const reduccion = reducir(ast_resultante.js1.clases);
  const copias = copia(reduccion.reducciones);
  console.log(reduccion);
  let r_copia = {
    clases: r_clases,
    funciones: r_funciones,
    variables: r_variables
  }
  response.json(r_copia);
});



function an(entradaBase) {

  try {

    let ast;
    ast = parser.parse(entradaBase.toString());

    //Generar JSON del arbol ast    
    let res = {
      js1: ast
    }

    return res;

  } catch (e) {
    console.error(e);
    let error = {

      js1: 'Ha ocurrido un error'
    }
    return error;
  }
}



function variable(id, clase, funcion, tipo_dato) {
  return {
    variable: id,
    caracteristicas: {
      clase: clase,
      funcion: funcion,
      tipo_dato: tipo_dato
    }
  }
}


function reducir(ast) {
  let res = {
    reducciones: []
  };

  //Recorrido de todas las clases ingresadas
  for (let i = 0; i < ast.length; i++) {
    res.reducciones.push(reducir_ast(ast[i]));
  }
  return res;
}

function reducir_ast(ast) {

  let r1 = {
    id_clase: '',
    funciones: [],
    declaraciones: []
  };

  try {

    let ast1 = ast;


    let l1 = ast1.clase.contenido_clase.length;

    r1['id_clase'] = ast1.clase['identificador'];

    let cf = 0;
    for (let i = 0; i < l1; i++) {
      if (ast1.clase.contenido_clase[i].instruccion['tipo'] == 'FUNCION') {
        cf++;
        var a = {
          nombre: ast1.clase.contenido_clase[i].instruccion.funcion['identificador'],
          retorno: ast1.clase.contenido_clase[i].instruccion.funcion['tipo_retorno'],
          parametros: ast1.clase.contenido_clase[i].instruccion.funcion['parametros'],
          clase: ast1.clase['identificador']
        }
        r1.funciones.push(a);

        /**
         * Recorrido para buscar declaraciones
         */

        for (let j = 0; j < ast1.clase.contenido_clase[i].instruccion.funcion.contenido_metodo.length; j++) {
          if (ast1.clase.contenido_clase[i].instruccion.funcion.contenido_metodo[j].instruccion['tipo'] == 'DECLARACION') {
            let valor = ast1.clase.contenido_clase[i].instruccion.funcion.contenido_metodo[j].instruccion;

            /**
             * Crear objetos para todas las variables dentro de la declaracion 
             */
            for (let k = 0; k < valor.declaracion.variables.length; k++) {
              let nf = ast1.clase.contenido_clase[i].instruccion.funcion['identificador'];
              let td = ast1.clase.contenido_clase[i].instruccion.funcion.contenido_metodo[j].instruccion.declaracion['tipo_dato'];
              r1.declaraciones.push(variable(valor.declaracion.variables[k]['identificador'], ast1.clase['identificador'], nf, td));
            }
          }
        }

      }
    }
    fs.writeFileSync('./out/r1.json', JSON.stringify(r1, null, 2));


    let respuesta = {
      status: 'correcto',
      reduccion: r1
    }
    return respuesta;
  } catch (e) {
    console.error(e);

    let respuesta = {
      status: 'error',
      reduccion1: 'Ha ocurrido un error'
    }
    return respuesta;
  }
}

/* 
////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//////////////////////////////// DETECCION DE COPIAS ///////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////
*/


//Arrays para resultados de copias
let r_clases = [];
let r_funciones = [];
let r_variables = [];



/**
 * 
 * @param {ast reducido} jsonn 
 *
 */


function copia(jsonn) {

  for (let i = 0; i < jsonn.length - 1; i++) {
    let copia1 = jsonn[i].reduccion;
    for (let j = i + 1; j < jsonn.length; j++) {
      let copia2 = jsonn[j].reduccion;
      detectar_copia(copia1, copia2);
    }
  }
}


function detectar_copia(js1, js2) {
  copia_clase(js1, js2);
  copia_variables(js1, js2);
}


let reporte_clase = {
  nombre: '',
  funciones: 0
};

let reporte_funciones = {
  copias: []
};

let reporte_variables = {
  copias: []
};


function copia_clase(js1, js2) {

  try {

    let ast1 = js1;
    let ast2 = js2;

    if (copia_funciones(ast1, ast2) == true && ast1['id_clase'] == ast2['id_clase']) {
      reporte_clase['nombre'] = ast1['id_clase'];
      reporte_clase['funciones'] = ast1.funciones.length;
      r_clases.push(reporte_clase);
      console.log('Comparando True: ' + ast1['id_clase'], ast2['id_clase']);
      return true;
    } else {
      console.log('Comparando False: ' + ast1['id_clase'], ast2['id_clase']);
      return false;
    }
  } catch (e) {
    console.error(e);
    return;
  }
}

function copia_funciones(cl1, cl2) {


  if (cl1.funciones.length == cl2.funciones.length) {

    for (let i = 0; i < cl1.funciones.length; i++) {
      let f1 = cl1.funciones[i];
      let contador = 0;
      for (let j = 0; j < cl2.funciones.length; j++) {
        let f2 = cl2.funciones[j];
        if (verificar_funcion(f1, f2) == true) {
          contador++;
        }
      }
      if (contador == 0) {
        return false;
      }
    }

    return true;
  }
  return false;
}

function verificar_funcion(funcion1, funcion2) {
  if (funcion1.parametros.length == funcion2.parametros.length) {

    for (let i = 0; i < funcion1.parametros.length; i++) {
      let param1 = funcion1.parametros[i];
      let param2 = funcion2.parametros[i];

      if (param1['tipo_dato'] != param2['tipo_dato']) {
        console.log('entro');
        console.log('Comparando: ' + funcion1['nombre'], funcion2['nombre']);
        return false;
      }
    }
    if (funcion1['retorno'] == funcion2['retorno'] && funcion1['clase'] == funcion2['clase']) {
      console.log('entro');
      console.log('Comparando2: ' + funcion1['nombre'], funcion2['nombre']);
      var res = {
        clase: funcion1['clase'],
        id_f1: funcion1['nombre'],
        id_f2: funcion2['nombre'],
        retorno: funcion2['retorno'],
        parametros: funcion2.parametros
      }
      r_funciones.push(res);
      return true;
    }
    return false;
  }
  return false;
}



function copia_variables(js1, js2) {
  try {

    let ast1 = js1;
    let ast2 = js2;

    for (let i = 0; i < ast1.declaraciones.length; i++) {
      let v1 = ast1.declaraciones[i];
      for (let j = 0; j < ast2.declaraciones.length; j++) {
        let v2 = ast2.declaraciones[j];
        if (verificar_variable(v1, v2) == true) {
          var a = {
            clase: v1.caracteristicas['clase'],
            funcion: v1.caracteristicas['funcion'],
            tipo_dato: v1.caracteristicas['tipo_dato'],
            var1: v1['variable'],
            var2: v2['variable']
          }
          reporte_variables.copias.push(a);
          r_variables.push(a);
        }
      }
    }
  } catch (e) {
    console.error(e);
    return;
  }
}

function verificar_variable(var1, var2) {

  if (var1.caracteristicas['clase'] == var2.caracteristicas['clase'] && var1.caracteristicas['funcion'] == var2.caracteristicas['funcion'] && var1.caracteristicas['tipo_dato'] == var2.caracteristicas['tipo_dato']) {
    return true;
  }
  return false;
}