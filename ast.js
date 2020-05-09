
// Constantes para los tipos de 'valores' que reconoce nuestra gramática.
const TIPO_VALOR = {
	ENTERO:         'int',
	IDENTIFICADOR:  'id',
	CADENA:         'string',
	BOOLEANO:		'boolean',
	CARACTER:		'char',
	DOUBLE:  		'double'
};

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
	DCLASE: 		'Declaracion de Clase',
	METODO:         'METODO',
	FUNCION: 		'FUNCION',
	DO_WHILE:		'DO_WHILE'

};

const TIPO_OPCION_SWITCH = { 
	CASE: 			'CASE',
	DEFAULT: 		'DEFAULT'
};



const API = {

	astClase: function(identificador, instrucciones){
		var a = {
			identificador : identificador,
			instrucciones : instrucciones
		};
		return{
			tipo: TIPO_INSTRUCCION.DCLASE,
			clase: a
		}
		
	},

	astImport: function (identificador){
		return{
			tipo: TIPO_INSTRUCCION.IMPORT,
			identificador : identificador
		}
	},

	astMetodo: function ( tipo_retorno , identificador, parametros,  instrucciones){
		var a = {
			iden: identificador,
			tipo_retorno: tipo_retorno,
			parametros: parametros,
			instrucciones: instrucciones
		};
		var b = {
			instruccion: TIPO_INSTRUCCION.METODO,
			metodo: a
		}
		return{
			instruccion : b
		}		
	},

	astFuncion: function ( tipo_retorno , identificador, parametros,  instrucciones){
			
			var b = {
				identificador : identificador,
				tipo_retorno: tipo_retorno,
				parametros: parametros,
				instrucciones: instrucciones
			};

			var a = {
				tipo: TIPO_INSTRUCCION.FUNCION,
				funcion: b
			};
			return{
				instruccion : a
			}		
	},


	astListaP: function( identificador){
		var lista_id = [];
		lista_id.push(identificador);
		return lista_id;
	},

	
	astParametro: function ( tipo , identificador ){
		return{
			tipo_dato : tipo,
			parametro : identificador
		}
	},
	
	astDeclaracion: function (tipo , identificador , expresion){
		var a = {
			tipo_dato: tipo,
			variables: identificador,
			expresion: expresion
		};
		
		var b = {
			tipo: TIPO_INSTRUCCION.DECLARACION,
			declaracion: a
		}

		return{
			instruccion : b
		}
	},

	astDeclaN: function( tipo , identificadores){
		var a = {
			tipo_dato: tipo,
			variables: identificadores
		};
		
		var b = {
			tipo: TIPO_INSTRUCCION.DECLARACION,
			declaracion: a
		}

		return{
			instruccion : b
		}
	},

	/**
	 * Crea un objeto tipo ast para una lista de identificadores.
	 * @param {*} identificador 
	 */	
	astListaI: function( identificador){
		var lista_id = [];
		lista_id.push(identificador);
		return lista_id;
	},

	 astIden: function(identificador){
		 return{
			identificador : identificador	 
		}
	 },

	 astAsignacion: function( identificador , expresion ){
		var a = {
			variables : identificador,
			expresion : expresion
		};

		var b = {
			tipo : TIPO_INSTRUCCION.ASIGNACION,
			asignacion : a
		};
		return{
			instruccion : b
		}

	 },

	 astWhile: function( condicion , instrucciones){
		var a = {
			tipo: TIPO_INSTRUCCION.WHILE,
			condicion: condicion,
			bloque_sentencias: instrucciones
		};
		return{
			instruccion : a
		 }
	 },

	 astFor: function (variable, valor, condicion, aumento, instrucciones) {
		var a = {
			tipo: TIPO_INSTRUCCION.FOR,
			variable: variable,
			valor_inicial: valor,
			condicion: condicion,
			bloque_sentencias: instrucciones,
			aumento: aumento		};
		return{
			instruccion : a
		 }
	},

	astForD: function (variable, valor, condicion, aumento, instrucciones) {
		var a = {
			tipo: TIPO_INSTRUCCION.FOR,
			variable: variable,
			valor_inicial: valor,
			condicion: condicion,
			bloque_sentencias: instrucciones,
			decremento: aumento		};
		return{
			instruccion : a
		 }
	},

	astIf: function(condicion, instrucciones) {
		return{
			condicion: condicion,
			sentencias: instrucciones		 
		}
	},

	astElseifC: function(rif , elseIf){
		var a = {
			tipo : TIPO_INSTRUCCION.IF,
			IF : rif,
			ELSE_IF: elseIf
		};
		return{
			instruccion : a
		 }
	},

	astRif: function( rif){
		var a = {
			tipo : TIPO_INSTRUCCION.IF,
			IF : rif
		};
		return{
			instruccion : a
		}
	},

	astElseC: function(rif, relse){
		var a = {
			tipo: TIPO_INSTRUCCION.IF,
			IF: rif,
			ELSE: relse
		};
		return{
			instruccion : a
		 }
	},

	astIfCompleto: function(rif, relif, relse){
		var a = {
			tipo: TIPO_INSTRUCCION.IF,
			IF: rif,
			ELSE_IF: relif,
			ELSE: relse
		};
		return{
			instruccion : a
		 }
	},

	astelif: function ( elsif ){
		var elsei = [];
		elsei.push(elsif);
		return elsei;
	},

	astElseif: function( condicion , instrucciones){
		var a = {
			condicion: condicion,
			sentencias: instrucciones
		}
		return {
			else_if : a
		}
	},

	astElse: function ( instrucciones ){
		return{
			sentencias: instrucciones
		}
	},

	astSwitch: function(expresion , casos){
		var a = {
			tipo: TIPO_INSTRUCCION.SWITCH,
			expresion: expresion,
			cases: casos

		}
		return{
			instruccion : a
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
		var a = {
			tipo: TIPO_INSTRUCCION.DO_WHILE,
			condicion: condicion,
			bloque_sentencias: instrucciones

		}
		return{
			instruccion : a	
		}
	},

	

	nuevoOperador: function(operador){
		return operador 
	},

	nuevoOperacionBinaria: function(operandoIzq, operandoDer, tipo) {
		return {
			operandoIzq: operandoIzq,
			operandoDer: operandoDer,
			tipo: tipo
		}
	},


	nuevoOperacionUnaria: function(operando, tipo) {
		return {
			operandoIzq: operandoIzq,
			operandoDer: undefined,
			tipo: tipo
		}
	},

	nuevoValor: function(valor, tipo) {
		return {
			tipo: tipo,
			valor: valor
		}
	},

	astBreak: function( brk ){
		return{
			instruccion : brk
		}
	},

	astContinue: function( cont ){
		return{
			instruccion : cont
		}
	},

	astReturn: function( tipo,  rtn ){
		var a = {
			tipo : tipo,
			expresion : rtn
		}
		var b = {
			return : a
		}

		return{
			instruccion : b
		}
	},

	astSout: function ( contenido ){
		var a = {
			valor : contenido
		}
		var b = {
			tipo : "SYSTEM OUT",
			sout : a
		}


		return{
			instruccion :b
		}
	},

	astLlamadaM: function (identificador, variables){
		var a = {
			identificador : identificador,
			parametros : variables
		};
		var b = {
			tipo : "LLAMADA FUNCION",
			funcion : a
		};
		return{
			instruccion : b
		}
	},

	astValores : function ( valor ){
		var valores = [];
		valores.push(valor);
		return valores;
	},

	astValor : function (exp){
		return{
			parametro : exp
		}
	}

}

// Exportamos nuestras constantes y nuestra API

module.exports.TIPO_OPERACION = TIPO_OPERACION;
module.exports.TIPO_INSTRUCCION = TIPO_INSTRUCCION;
module.exports.TIPO_VALOR = TIPO_VALOR;
module.exports.API = API;
module.exports.TIPO_OPCION_SWITCH = TIPO_OPCION_SWITCH;
