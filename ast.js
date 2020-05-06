
// Constantes para los tipos de 'valores' que reconoce nuestra gramática.
const TIPO_VALOR = {
	ENTERO:         'ENTERO',
	IDENTIFICADOR:  'IDENTIFICADOR',
	CADENA:         'CADENA',
	BOOLEANO:		'BOOLEANO',
	CARACTER:		'CARACTER',
	DOUBLE:  		'DOUBLE'
}

// Constantes para los tipos de 'operaciones' que soporta nuestra gramática.
const TIPO_OPERACION = {
	SUMA:           'SIG_SUMA',
	RESTA:          'SIG_RESTA',
	MULTIPLICACION: 'SIG_MULTIPLICACION',
	DIVISION:       'SIG_DIVISION',
	NEGATIVO:       'SIG_NEGATIVO',
	MAYOR_QUE:      'SIG_MAYORQUE',
	MENOR_QUE:      'SIG_MENORQUE',

	MAYOR_IGUAL: 	'SIG_MAYORIGUAL',
	MENOR_IGUAL:    'SIG_MENORIGUAL',
	DOBLE_IGUAL:    'SIG_IGUALIGUAL',
	NO_IGUAL:    	'SIG_NOT',

	AND:  			'SIG_AND',
	OR: 			'SIG_OR',
	NOT:   			'SIG_NOT',  	

	CONCATENACION:  'SIG_CONCAT'
};

// Constantes para los tipos de 'instrucciones' válidas en nuestra gramática.
const TIPO_INSTRUCCION = {
	CONSOLE:		'CONSOLE_WRITE',
	WHILE:			'WHILE',
	DECLARACION:	'DECLARACION',
	ASIGNACION:		'ASIGNACION',
	IF:				'IF',
	IF_ELSE:		'ELSE IF',
	ELSE:    		'ELSE',
	FOR: 			'FOR',
	SWITCH:			'SWITCH',
	SWITCH_OP:		'SWITCH_OP',
	SWITCH_DEF:		'SWITCH_DEF',
	ASIGNACION_SIMPLIFICADA: 'ASIGNACION_SIMPLIFICADA',
	IMPORT:         'IMPORT',
	DCLASE: 		'DECLARACION_CLASE',
	METODO:         'METODO',
	FUNCION: 		'FUNCION',
	DO_WHILE:		'DO_WHILE'

}

const TIPO_OPCION_SWITCH = { 
	CASE: 			'CASE',
	DEFAULT: 		'DEFAULT'
} 


const API = {

	astClase: function(identificador, instrucciones){
		return{
			tipo: TIPO_INSTRUCCION.DCLASE,
			identificador : identificador,
			instrucciones : instrucciones
		} 
	},

	astImport: function (identificador){
		return{
			tipo: TIPO_INSTRUCCION.IMPORT,
			identificador : identificador
		}
	},

	astMetodo: function ( tipo_retorno , identificador, parametros,  instrucciones){
		return{
			tipo: TIPO_INSTRUCCION.METODO,
			identificador = identificador,
			tipo_retorno: tipo_retorno,
			parametros: parametros,
			instrucciones: instrucciones
		}
	},

	astFuncion: function ( tipo_retorno , identificador, parametros,  instrucciones){
		return{
			tipo: TIPO_INSTRUCCION.FUNCION,
			identificador = identificador,
			tipo_retorno: tipo_retorno,
			parametros: parametros,
			instrucciones: instrucciones
		}
	},
	
	astParametro: function ( tipo , identificador ){
		return{
			tipo_dato : tipo,
			parametro : identificador
		}
	},
	
	astDeclaracion: function (tipo , identificador , expresion){
		return{
			tipo: TIPO_INSTRUCCION.DECLARACION,
			tipo_dato: tipo,
			identificador: identificador,
			expresion: expresion
		}
	},

	astDeclaN: function( tipo , identificadores){
		return{
			tipo: TIPO_INSTRUCCION.DECLARACION,
			tipo_dato: tipo,
			identificadores = identificadores
		}
	},

	/**
	 * Crea un objeto tipo ast para una lista de identificadores.
	 * @param {*} identificador 
	 */	

	 astListaIden: function(identificador){
		 return{
			identificador = identificador	 
		}
	 },

	 astAsignacion: function( identificador , expresion ){
		return{
			identificador = identificador,
			expresion = expresion
		}

	 },

	 astWhile: function( condicion , instrucciones){
		 return{
			 tipo: TIPO_INSTRUCCION.WHILE,
			 condicion: condicion,
			 bloque_sentencias: instrucciones
		 }
	 },

	 astFor: function (variable, valor, condicion, aumento, instrucciones) {
		return {
			tipo: TIPO_INSTRUCCION.FOR,
			variable: variable,
			valor_inicial: valor,
			condicion: condicion,
			bloque_sentencias: instrucciones,
			aumento: aumento
		}
	},

	astForD: function (variable, valor, condicion, aumento, instrucciones) {
		return {
			tipo: TIPO_INSTRUCCION.FOR,
			variable: variable,
			valor_inicial: valor,
			condicion: condicion,
			bloque_sentencias: instrucciones,
			decremento: aumento
		}
	},

	astIf: function(condicion, instrucciones) {
		return {
			tipo: TIPO_INSTRUCCION.IF,
			condicion: condicion,
			sentencias: instrucciones
		}
	},

	astElseif: function( condicion , instrucciones){
		return {
			tipo: TIPO_INSTRUCCION.IF_ELSE,
			condicion: condicion,
			sentencias: instrucciones
		}
	},

	astElse: function ( instrucciones ){
		return{
			tipo: TIPO_INSTRUCCION.ELSE,
			sentencias: instrucciones
		}
	},

	astSwitch: function(expresion , casos){
		return{
			tipo: TIPO_INSTRUCCION.SWITCH,
			expresion: expresion,
			cases: casos
		}
	},

	astCases: function(caso){
		var casos = [];
		casos.push(caso);
		return casos;
	},

	astCase: function(expresion , instrucciones){
		return{
			tipo: TIPO_OPCION_SWITCH.CASE,
			expresion: expresion,
			bloque_sentencias: instrucciones
		}
	}
	,

	astCaseDef: function( instrucciones){
		return{
			tipo: TIPO_OPCION_SWITCH.DEFAULT,
			bloque_sentencias: instrucciones
		}
	},

	astDoWhile: function ( condicion , instrucciones){
		return{
			tipo: TIPO_INSTRUCCION.DO_WHILE,
			condicion: condicion,
			bloque_sentencias: instrucciones
		}
	},

	nuevoOperador: function(operador){
		return operador 
	},

	nuevoOperacionBinaria: function(operandoIzq, operandoDer, tipo) {
		return nuevaOperacion(operandoIzq, operandoDer, tipo);
	},


	nuevoOperacionUnaria: function(operando, tipo) {
		return nuevaOperacion(operando, undefined, tipo);
	},

	nuevoValor: function(valor, tipo) {
		return {
			tipo: tipo,
			valor: valor
		}
	}
}

// Exportamos nuestras constantes y nuestra API

module.exports.TIPO_OPERACION = TIPO_OPERACION;
module.exports.TIPO_INSTRUCCION = TIPO_INSTRUCCION;
module.exports.TIPO_VALOR = TIPO_VALOR;
module.exports.instruccionesAPI = instruccionesAPI;
module.exports.TIPO_OPCION_SWITCH = TIPO_OPCION_SWITCH;
