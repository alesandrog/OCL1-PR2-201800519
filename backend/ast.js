const TIPO_VALOR = {
	ENTERO: 'int',
	IDENTIFICADOR: 'id',
	CADENA: 'string',
	BOOLEANO: 'boolean',
	CARACTER: 'char',
	DOUBLE: 'double'
};

const TIPO_OPERACION = {
	SUMA: 'suma',
	RESTA: 'resta',
	MULTIPLICACION: 'multiplicacion',
	DIVISION: 'division',
	POTENCIA: 'potencia',
	MODULO: 'modulo',
	NEGATIVO: 'inverso',
	MAYOR_QUE: 'mayor que',
	MENOR_QUE: 'menor que',

	MAYOR_IGUAL: 'mayor igual',
	MENOR_IGUAL: 'menor igual',
	DOBLE_IGUAL: 'igual igual',
	NO_IGUAL: 'diferente',

	AND: 'and',
	OR: 'or',
	NOT: 'not',

	CONCATENACION: 'concatenar'
};

const TIPO_INSTRUCCION = {
	CONSOLE: 'CONSOLE_WRITE',
	WHILE: 'WHILE',
	DECLARACION: 'DECLARACION',
	ASIGNACION: 'ASIGNACION',
	IF: 'IF',
	IF_ELSE: 'ELSE IF',
	ELSE: 'ELSE',
	FOR: 'FOR',
	SWITCH: 'SWITCH',
	SWITCH_OP: 'SWITCH_OP',
	SWITCH_DEF: 'SWITCH_DEF',
	IMPORT: 'IMPORT',
	DCLASE: 'Declaracion de Clase',
	METODO: 'METODO',
	FUNCION: 'FUNCION',
	DO_WHILE: 'DO_WHILE'

};

const TIPO_OPCION_SWITCH = {
	CASE: 'CASE',
	DEFAULT: 'DEFAULT'
};


var e = [];
var es = [];
const RECOPILACION_ERRORES = {

	astPrint: function (jso) {
		var fs = require('fs');
		try {

			fs.writeFileSync('./out/errores.json', JSON.stringify(jso, null, 2));

		} catch (er) {
			console.error(er);
			return;
		};
	},

	astPrintS: function (jso) {
		var fs = require('fs');
		try {

			fs.writeFileSync('./out/erroresS.json', JSON.stringify(jso, null, 2));

		} catch (er) {
			console.error(er);
			return;
		};
	},

	astErrores: function (error) {
		e.push(error);
		return e;
	},

	astError: function (e, f, c, tipo) {
		return {
			error: e,
			fila: f,
			columna: c,
			tipo : tipo
		}
	},

	astErroresS: function (error) {
		es.push(error);
		return es;
	},

	astErrorS: function (e, f, c, tipo) {
		return {
			error: e,
			fila: f,
			columna: c,
			tipo : tipo
		}
	}
}


const API = {

	astArchivo : function (imports , clases){
		return {
			imports : imports,
			clases : clases
		}
	},

	astClases: function (clase) {
		var lista_clases = [];
		lista_clases.push(clase);
		return lista_clases;
	},


	astClase: function (identificador, contenido_metodo) {
		var a = {
			identificador: identificador,
			contenido_clase: contenido_metodo
		};
		return {
			tipo: TIPO_INSTRUCCION.DCLASE,
			clase: a,
		}

	},

	astImports: function (imp) {
		var lista_imports = [];
		lista_imports.push(imp);
		return lista_imports;
	},

	astImport: function (identificador) {
		return {
			tipo: TIPO_INSTRUCCION.IMPORT,
			identificador: identificador
		}
	},

	astMetodo: function (tipo_retorno, identificador, parametros, contenido_metodo) {
		var a = {
			identificador: identificador,
			tipo_retorno: tipo_retorno,
			parametros: parametros,
			contenido_metodo: contenido_metodo
		};
		var b = {
			tipo: TIPO_INSTRUCCION.FUNCION,
			funcion: a
		}
		return {
			instruccion: b
		}
	},

	astFuncion: function (tipo_retorno, identificador, parametros, contenido_metodo) {
		var b = {
			identificador: identificador,
			tipo_retorno: tipo_retorno,
			parametros: parametros,
			contenido_metodo: contenido_metodo
		};

		var a = {
			tipo: TIPO_INSTRUCCION.FUNCION,
			funcion: b
		};
		return {
			instruccion: a
		}
	},


	astListaP: function (identificador) {
		var lista_id = [];
		lista_id.push(identificador);
		return lista_id;
	},


	astParametro: function (tipo, identificador) {
		return {
			tipo_dato: tipo,
			parametro: identificador
		}
	},

	astDeclaracion: function (tipo, identificador, expresion) {
		var a = {
			tipo_dato: tipo,
			variables: identificador,
			expresion: expresion
		};

		var b = {
			tipo: TIPO_INSTRUCCION.DECLARACION,
			declaracion: a
		}

		return {
			instruccion: b
		}
	},

	astDeclaN: function (tipo, identificadores) {
		var a = {
			tipo_dato: tipo,
			variables: identificadores
		};

		var b = {
			tipo: TIPO_INSTRUCCION.DECLARACION,
			declaracion: a
		}

		return {
			instruccion: b
		}
	},

	/**
	 * Crea un objeto tipo ast para una lista de identificadores.
	 * @param {*} identificador 
	 */
	astListaI: function (identificador) {
		var lista_id = [];
		lista_id.push(identificador);
		return lista_id;
	},

	astIden: function (identificador) {
		return {
			identificador: identificador
		}
	},

	astAsignacion: function (identificador, expresion) {
		var a = {
			variables: identificador,
			expresion: expresion
		};

		var b = {
			tipo: TIPO_INSTRUCCION.ASIGNACION,
			asignacion: a
		};
		return {
			instruccion: b
		}

	},

	astWhile: function (condicion, contenido_metodo) {
		var a = {
			tipo: TIPO_INSTRUCCION.WHILE,
			condicion: condicion,
			bloque_sentencias: contenido_metodo
		};
		return {
			instruccion: a
		}
	},

	astFor: function (variable, valor, condicion, aumento, contenido_metodo) {
		var a = {
			tipo: TIPO_INSTRUCCION.FOR,
			variable: variable,
			valor_inicial: valor,
			condicion: condicion,
			bloque_sentencias: contenido_metodo,
			aumento: aumento
		};
		return {
			instruccion: a
		}
	},

	astForD: function (variable, valor, condicion, aumento, contenido_metodo) {
		var a = {
			tipo: TIPO_INSTRUCCION.FOR,
			variable: variable,
			valor_inicial: valor,
			condicion: condicion,
			bloque_sentencias: contenido_metodo,
			decremento: aumento
		};
		return {
			instruccion: a
		}
	},

	astIf: function (condicion, contenido_metodo) {
		return {
			condicion: condicion,
			sentencias: contenido_metodo
		}
	},

	astElseifC: function (rif, elseIf) {
		var a = {
			tipo: TIPO_INSTRUCCION.IF,
			IF: rif,
			ELSE_IF: elseIf
		};
		return {
			instruccion: a
		}
	},

	astRif: function (rif) {
		var a = {
			tipo: TIPO_INSTRUCCION.IF,
			IF: rif
		};
		return {
			instruccion: a
		}
	},

	astElseC: function (rif, relse) {
		var a = {
			tipo: TIPO_INSTRUCCION.IF,
			IF: rif,
			ELSE: relse
		};
		return {
			instruccion: a
		}
	},

	astIfCompleto: function (rif, relif, relse) {
		var a = {
			tipo: TIPO_INSTRUCCION.IF,
			IF: rif,
			ELSE_IF: relif,
			ELSE: relse
		};
		return {
			instruccion: a
		}
	},

	astelif: function (elsif) {
		var elsei = [];
		elsei.push(elsif);
		return elsei;
	},

	astElseif: function (condicion, contenido_metodo) {
		var a = {
			condicion: condicion,
			sentencias: contenido_metodo
		}
		return {
			ELSE_IF: a
		}
	},

	astElse: function (contenido_metodo) {
		return {
			sentencias: contenido_metodo
		}
	},

	astSwitch: function (expresion, casos) {
		var a = {
			tipo: TIPO_INSTRUCCION.SWITCH,
			expresion: expresion,
			cases: casos

		}
		return {
			instruccion: a
		}
	},

	astCases: function (caso) {
		var casos = [];
		casos.push(caso);
		return casos;
	},

	astCase: function (expresion, contenido_metodo) {
		return {
			tipo: TIPO_OPCION_SWITCH.CASE,
			expresion: expresion,
			contenido_case: contenido_metodo
		}
	},

	astCaseDef: function (contenido_metodo) {
		return {
			tipo: TIPO_OPCION_SWITCH.DEFAULT,
			contenido_case: contenido_metodo
		}
	},

	astDoWhile: function (condicion, contenido_metodo) {
		var a = {
			tipo: TIPO_INSTRUCCION.DO_WHILE,
			condicion: condicion,
			bloque_sentencias: contenido_metodo

		}
		return {
			instruccion: a
		}
	},



	nuevoOperador: function (operador) {
		return operador
	},

	expresion: function (operandoIzq, operandoDer, tipo) {
		return {
			expresion1: operandoIzq,
			expresion2: operandoDer,
			tipo: tipo
		}
	},


	expresionU: function (operando, tipo) {
		return {
			expresion1: operandoIzq,
			expresion2: undefined,
			tipo: tipo
		}
	},

	nuevoValor: function (valor, tipo) {
		return {
			tipo: tipo,
			valor: valor
		}
	},

	astBreak: function (brk) {
		return {
			instruccion: brk
		}
	},

	astContinue: function (cont) {
		return {
			instruccion: cont
		}
	},

	astReturn: function (tipo, rtn) {
		var a = {
			tipo: tipo,
			expresion: rtn
		}
		var b = {
			return: a
		}

		return {
			instruccion: b
		}
	},

	astSout: function (contenido) {
		var a = {
			valor: contenido
		}
		var b = {
			tipo: "SYSTEM OUT",
			sout: a
		}


		return {
			instruccion: b
		}
	},

	astLlamadaM: function (identificador, variables) {
		var a = {
			identificador: identificador,
			parametros: variables
		};
		var b = {
			tipo: "LLAMADA FUNCION",
			funcion: a
		};
		return {
			instruccion: b
		}
	},

	astValores: function (valor) {
		var valores = [];
		valores.push(valor);
		return valores;
	},

	astValor: function (exp) {
		return {
			parametro: exp
		}
	}

}



module.exports.TIPO_OPERACION = TIPO_OPERACION;
module.exports.TIPO_INSTRUCCION = TIPO_INSTRUCCION;
module.exports.TIPO_VALOR = TIPO_VALOR;
module.exports.API = API;
module.exports.TIPO_OPCION_SWITCH = TIPO_OPCION_SWITCH;
module.exports.RECOPILACION_ERRORES = RECOPILACION_ERRORES;