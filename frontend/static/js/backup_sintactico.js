let tabla_simbolos = [];
let pos = 0;
let token_actual;
let salida = ";";
let resultado_sintactico = [];
let resultado_tokens = [];
let metodo = false;
let instruccion = false;
let ciclo = false;
let traduccion = "";
let aux_traduccion = "";
let contador_tab = 0;
let variable = false;
let tipo_dato = "";
let lista_iden = [];
let tipo_global = "";

let identificador_aux;


function parser() {

	token_actual = flujo_tokens[pos];
	CUERPO();
}
/* -----------------------------------DEFINICIONES PARA CUERPO------------------------------------------ */

function CUERPO() {
	if (token_actual["tipo"] == Tipo.RESERVADA_CLASS) {
		pair(Tipo.RESERVADA_CLASS);
		pair(Tipo.IDENTIFICADOR);
		pair(Tipo.LLAVE_ABRIR);
		CLASS();
		pair(Tipo.LLAVE_CERRAR);
	} else if (token_actual["tipo"] == Tipo.INICIO_COMENS) {
		COMENTARIO_SC();
	}
	else if (token_actual["tipo"] == Tipo.INICIO_COMENM) {
		COMENTARIO_MC();
	}
}

function COMENTARIO_SC() {
	pair(Tipo.INICIO_COMENS);
	traduccion += "#";
	traduccion = traduccion + token_actual["valor"] + "\n";
	pair(Tipo.COMENTARIO_S);
	CUERPO();
}

function COMENTARIO_MC() {
	pair(Tipo.INICIO_COMENM);
	traduccion = traduccion + "\"'" + "\n";
	traduccion += token_actual["valor"] + "\n";
	traduccion += "\"'" + "\n";
	pair(Tipo.COMENTARIO_M);
	pair(Tipo.FIN_COMENM);
	CUERPO();
}

/*-----------------------------------DEFINICIONES PARA CLASS------------------------------------------ */

function CLASS() {

	if (token_actual["tipo"] == Tipo.INICIO_COMENS) {
		COMENTARIO_S();
	}
	else if (token_actual["tipo"] == Tipo.INICIO_COMENM) {
		COMENTARIO_M();
	}
	else if (token_actual["tipo"] == Tipo.TIPO_DATO || token_actual["tipo"] == Tipo.IDENTIFICADOR) {
		contador_tab++;
		DECLARACION();
		contador_tab--;
	}
	else if (token_actual["tipo"] == Tipo.VOID) {
		metodo = true;
		METODO();
		metodo = false;
	}
	else if (token_actual["tipo"] == Tipo.MOD_ACCESO) {
		metodo = true;
		MOD_ACCESO();
		metodo = false;
	}

}

function COMENTARIO_S() {
	pair(Tipo.INICIO_COMENS);
	traduccion += "#" + "\n";
	traduccion = traduccion + token_actual["valor"] + "\n";
	pair(Tipo.COMENTARIO_S);
	CLASS();
}

function COMENTARIO_M() {
	pair(Tipo.INICIO_COMENM);
	traduccion = traduccion + "\"'" + "\n";
	traduccion += token_actual["valor"] + "\n";
	traduccion += "\"'" + "\n";
	pair(Tipo.COMENTARIO_M);
	pair(Tipo.FIN_COMENM);
	CLASS();
}

function DECLARACION() {
	for (let i = 0; i < contador_tab; i++) {
		traduccion += '\t';
	}
	if (token_actual["tipo"] == Tipo.TIPO_DATO) {
		variable = true;
		tipo_dato = token_actual["valor"];
		pair(Tipo.TIPO_DATO);
	}
	identificador_aux = token_actual["valor"];
	pair(Tipo.IDENTIFICADOR);
	TIPO_DECLARACION();
	CLASS();
}

function TIPO_DECLARACION() {
	if (token_actual["tipo"] == Tipo.COMA) {
		lista_iden.push(identificador_aux);
		console.log("lista");
		console.log(lista_iden);
		instruccion = true;
		LISTA_ID();
		variable = false;
		identificador_aux = "";
		traduccion = traduccion + "\n";
		auxlex = "";
		pair(Tipo.PUNTO_COMA);
		lista_iden = [];
		instruccion = false;
	}
	else if (token_actual["valor"] == "(") {
		metodo = true;
		FUNCION();
		metodo = false;
	}
	else if (token_actual["valor"] == "=") {
		if (variable == true) {
			traduccion = traduccion + "var " + identificador_aux + " ";
		} else {
			traduccion = traduccion + identificador_aux + " ";
		}
		instruccion = true;
		traduccion += token_actual["valor"];
		pair(Tipo.OPERADOR_RELACIONAL);
		EXP();
		traduccion = traduccion + " " + auxlex;
		auxlex = "";
		variable = false;
		identificador_aux = "";
		traduccion += token_actual["valor"] + "\n";
		pair(Tipo.PUNTO_COMA);
		instruccion = false;
	} else {
		//epsilon
	}
}

/* ---------------------------------DEFINICIONES PARA METODOS-------------------------------------- */

function CUERPO_METODO() {
	if (token_actual["tipo"] == Tipo.IF) {
		IF();
	}
	else if (token_actual["tipo"] == Tipo.FOR) {
		FOR();
	}
	else if (token_actual["tipo"] == Tipo.WHILE) {
		WHILE();
	}
	else if (token_actual["tipo"] == Tipo.SWITCH) {
		SWITCH();
	}
	else if (token_actual["tipo"] == Tipo.DO) {
		DO();
	}
	else if (token_actual["tipo"] == Tipo.CONSOLE) {
		instruccion = true;
		CONSOLE();
		instruccion = false;
	} else if (token_actual["tipo"] == Tipo.INICIO_COMENS) {
		COMENTARIO_SM();
	}
	else if (token_actual["tipo"] == Tipo.INICIO_COMENM) {
		COMENTARIO_MM();
	} else if (token_actual["tipo"] == Tipo.TIPO_DATO || token_actual["tipo"] == Tipo.IDENTIFICADOR) {
		instruccion = true;
		DECLARACION_M();
		instruccion = false;
	}
}

function COMENTARIO_SM() {
	pair(Tipo.INICIO_COMENS);
	traduccion += "#";
	traduccion = traduccion + token_actual["valor"] + "\n";
	pair(Tipo.COMENTARIO_S);
	CUERPO_();
}

function COMENTARIO_MM() {
	pair(Tipo.INICIO_COMENM);
	traduccion = traduccion + "\"'" + "\n";
	traduccion += token_actual["valor"] + "\n";
	traduccion += "\"'" + "\n";
	pair(Tipo.COMENTARIO_M);
	pair(Tipo.FIN_COMENM);
	CUERPO_METODO();
}

function DECLARACION_M() {
	if (token_actual["tipo"] == Tipo.TIPO_DATO) {
		variable = true;
		tipo_global = token_actual["valor"];
		pair(Tipo.TIPO_DATO);
	}
	identificador_aux = token_actual["valor"];
	pair(Tipo.IDENTIFICADOR);
	TIPO_DECLARACION_M();
	CUERPO_METODO();
}

function TIPO_DECLARACION_M() {
	if (token_actual["tipo"] == Tipo.COMA) {
		lista_iden.push(identificador_aux);
		console.log("lista");
		console.log(lista_iden);
		instruccion = true;
		LISTA_ID();
		variable = false;
		identificador_aux = "";
		traduccion = traduccion + "\n";
		auxlex = "";
		pair(Tipo.PUNTO_COMA);
		lista_iden = [];
		instruccion = false;
	}
	else if (token_actual["valor"] == "=") {
		if (variable == true) {
			traduccion = traduccion + "var " + identificador_aux + " ";
		} else {
			traduccion = traduccion + identificador_aux + " ";
		}
		instruccion = true;
		traduccion += token_actual["valor"];
		pair(Tipo.OPERADOR_RELACIONAL);
		EXP();
		traduccion = traduccion + " " + auxlex;
		auxlex = "";
		variable = false;
		identificador_aux = "";
		traduccion += token_actual["valor"] + "\n";
		pair(Tipo.PUNTO_COMA);
		instruccion = false;
	} else {
		//epsilon
	}
}




function LISTA_ID() {

	if (token_actual["tipo"] == Tipo.COMA) {
		pair(Tipo.COMA);
		lista_iden.push(token_actual["valor"]);
		pair(Tipo.IDENTIFICADOR);
		LISTA_ID();
	}
	else if (token_actual["valor"] == "=") {
		pair(Tipo.OPERADOR_RELACIONAL);
		EXP();
		for (let i = 0; i < lista_iden.length; i++) {
			traduccion += "var " + lista_iden[i] + " = " + auxlex + ";\n";
		}
	} else {
		//epsilon
		if (tipo_dato == "int") {
			for (let i = 0; i < lista_iden.length; i++) {
				traduccion += "var " + lista_iden[i] + " = 0;\n";
			}
		} else if (tipo_dato == "string") {
			for (let i = 0; i < lista_iden.length; i++) {
				traduccion += "var " + lista_iden[i] + " = \"\";\n";
			}
		} else if (tipo_dato == "bool") {
			for (let i = 0; i < lista_iden.length; i++) {
				traduccion += "var " + lista_iden[i] + " = false;\n";
			}
		} else if (tipo_dato == "char") {
			for (let i = 0; i < lista_iden.length; i++) {
				traduccion += "var " + lista_iden[i] + " = ' ';\n";
			}
		} else if (tipo_dato == "double") {
			for (let i = 0; i < lista_iden.length; i++) {
				traduccion += "var " + lista_iden[i] + " = 0;\n";
			}
		}

	}
}

function FUNCION() {
	traduccion = traduccion + "def " + identificador_aux + token_actual["valor"];
	identificador_aux = "";
	pair(Tipo.PAREN_ABRIR);
	PARAMETRO()
	traduccion = traduccion + " " + auxlex;
	auxlex = "";
	traduccion = traduccion + token_actual["valor"];
	pair(Tipo.PAREN_CERRAR);
	traduccion += ":\n";
	contador_tab++;
	pair(Tipo.LLAVE_ABRIR);
	CUERPO_METODO();
	if (token_actual["valor"] == "return") {
		instruccion = true;
		traduccion += '\t' + "return";
		pair(Tipo.RETURN);
		EXP();
		traduccion += auxlex + "\n" + "\n";
		auxlex = "";
		pair(Tipo.PUNTO_COMA);
		instruccion = false;
	}
	pair(Tipo.LLAVE_CERRAR);
	contador_tab--;
	CLASS();
}

function PARAMETRO() {
	if (token_actual["tipo"] == Tipo.TIPO_DATO) {
		pair(Tipo.TIPO_DATO);
		auxlex += token_actual["valor"];
		pair(Tipo.IDENTIFICADOR);
		MAS_PARAMETROS();
	} else {
		//epsilon
	}
}

function MAS_PARAMETROS() {
	if (token_actual["tipo"] == Tipo.COMA) {
		auxlex += token_actual["valor"] + " ";
		pair(Tipo.COMA);
		pair(Tipo.TIPO_DATO);
		auxlex += token_actual["valor"];
		pair(Tipo.IDENTIFICADOR);
		MAS_PARAMETROS();
	} else {
		//epsilon
	}
}

function IF() {
	pair(Tipo.IF);
	pair(Tipo.PAREN_ABRIR);
	CONDICION();
	pair(Tipo.PAREN_CERRAR);
	pair(Tipo.LLAVE_ABRIR);
	CUERPO_METODO();
	pair(Tipo.LLAVE_CERRAR);
	ELSE();
	CUERPO_METODO();
}

function ELSE() {
	if (token_actual["tipo"] == Tipo.ELSE) {
		pair(Tipo.ELSE);
		TIPO_ELSE();
	} else {
		//epsilon
	}
}

function TIPO_ELSE() {
	if (token_actual["tipo"] == Tipo.IF) {
		pair(Tipo.IF);
		pair(Tipo.PAREN_ABRIR);
		EXP();
		pair(Tipo.PAREN_CERRAR);
		pair(Tipo.LLAVE_ABRIR);
		CUERPO_METODO();
		pair(Tipo.LLAVE_CERRAR);
		ELSE();
	}
	else if (token_actual["tipo"] == Tipo.LLAVE_ABRIR) {
		pair(Tipo.LLAVE_ABRIR);
		CUERPO_METODO();
		pair(Tipo.LLAVE_CERRAR);
	}
	else {
		//epsilon
	}
}

function SWITCH() {
	pair(Tipo.SWITCH);
	pair(Tipo.PAREN_ABRIR);
	pair(Tipo.IDENTIFICADOR);
	pair(Tipo.PAREN_CERRAR);
	pair(Tipo.LLAVE_ABRIR);
	CASE();
	DEFAULT();
	pair(Tipo.LLAVE_CERRAR);
	CUERPO_METODO();
}

function CASE() {
	if (token_actual["tipo"] == Tipo.CASE) {
		pair(Tipo.CASE);
		pair(Tipo.IDENTIFICADOR);
		pair(Tipo.DOS_PUNTOS);
		CUERPO_METODO();
		if (token_actual["tipo"] == Tipo.BREAK) {
			pair(Tipo.BREAK);
			pair(Tipo.PUNTO_COMA);
		}
		pair(Tipo.PUNTO_COMA);
		CASE();
	} else {
		//epsilon
	}
}

function DEFAULT() {
	instruccion = true;
	if (token_actual["tipo"] == Tipo.DEFAULT) {
		pair(Tipo.DEFAULT);
		pair(Tipo.DOS_PUNTOS);
		CUERPO_METODO();
		if (token_actual["tipo"] == Tipo.BREAK) {
			pair(Tipo.BREAK);
			pair(Tipo.PUNTO_COMA);
		}
	}
	instruccion = false;
}

function FOR() {
	pair(Tipo.FOR);
	pair(Tipo.PAREN_ABRIR);
	if (token_actual["tipo"] == Tipo.TIPO_DATO) {
		pair(Tipo.TIPO_DATO);
		pair(Tipo.IDENTIFICADOR);
	}
	else if (token_actual["tipo"] == Tipo.IDENTIFICADOR) {
		pair(Tipo.IDENTIFICADOR);
	}
	if (token_actual["valor"] == "=") {
		pair(Tipo.OPERADOR_LOGICO);
	}
	EXP();
	pair(Tipo.PUNTO_COMA);
	EXP();
	pair(Tipo.PUNTO_COMA);
	INCREMENTO();
	pair(Tipo.PAREN_CERRAR);
	parser(Tipo.LLAVE_ABRIR);
	CUERPO_METODO();
	pair(Tipo.LLAVE_CERRAR);
	CUERPO_METODO();
}

function INCREMENTO() {
	pair(Tipo.IDENTIFICADOR);
	if (token_actual["tipo"] == Tipo.MAS_DOBLE) {
		pair(Tipo.MAS_DOBLE);
	}
	else if (token_actual["tipo"] == Tipo.MENOS_DOBLE) {
		pair(Tipo.MENOS_DOBLE);
	}
	else if (token_actual["tipo"] == Tipo.MAS_IGUAL) {
		pair(Tipo.MAS_IGUAL);
	}
	else if (token_actual["tipo"] == Tipo.MENOS_IGUAL) {
		pair(Tipo.MENOS_IGUAL);
	}
	else if (token_actual["valor"] == "=") {
		pair(Tipo.OPERADOR_LOGICO);
		EXP();
	}
}

function WHILE() {
	pair(Tipo.WHILE);
	pair(Tipo.PAREN_ABRIR);
	EXP();
	pair(Tipo.PAREN_CERRAR);
	pair(Tipo.LLAVE_ABRIR);
	CUERPO_METODO();
	pair(Tipo.LLAVE_CERRAR);
	CUERPO_METODO();
}

function DO() {
	pair(Tipo.DO);
	pair(Tipo.LLAVE_ABRIR);
	CUERPO_METODO();
	pair(Tipo.LLAVE_CERRAR);
	instruccion = true;
	pair(Tipo.WHILE);
	pair(Tipo.PAREN_ABRIR);
	EXP();
	pair(Tipo.PAREN_CERRAR);
	pair(Tipo.PUNTO_COMA);
	instruccion = false;
	CUERPO_METODO();
}


function CONSOLE() {
	pair(Tipo.CONSOLE);
	pair(Tipo.PUNTO);
	if (token_actual["tipo"] == Tipo.WRITE) {
		pair(Tipo.WRITE);
	} else if (token_actual["tipo"] == Tipo.WRITELINE) {
		pair(Tipo.WRITELINE);
	}
	pair(Tipo.PAREN_ABRIR);
	EXP();
	pair(Tipo.PAREN_CERRAR);
	pair(Tipo.PUNTO_COMA);
	CUERPO_METODO();
}

function EXP() {
	T();
	EP();
}

function EP() {
	if (token_actual["tipo"] == Tipo.SIGNO_MAS) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.SIGNO_MAS);
		T();
		EP();
	}
	else if (token_actual["tipo"] == Tipo.SIGNO_MENOS) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.SIGNO_MENOS);
		T();
		EP();
	} else if (token_actual["tipo"] == Tipo.OPERADOR_RELACIONAL) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.OPERADOR_RELACIONAL);
		T();
		EP();
	}
	else {
		//epsilon
	}
}

function T() {
	F();
	TP();
}

function TP() {
	if (token_actual["tipo"] == Tipo.SIGNO_POR) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.SIGNO_POR);
		F();
		TP();
	}
	else if (token_actual["tipo"] == Tipo.SIGNO_DIV) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.SIGNO_DIV);
		F();
		TP();
	} else if (token_actual["tipo"] == Tipo.OPERADOR_LOGICO) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.OPERADOR_LOGICO);
		F();
		TP();
	} else {
		//epsilon
	}
}

function F() {
	if (token_actual["tipo"] == Tipo.PAREN_ABRIR) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.PAREN_ABRIR);
		EXP();
		auxlex += " " + token_actual["valor"];
		pair(Tipo.PAREN_CERRAR);
	} else {
		if (token_actual["tipo"] == Tipo.IDENTIFICADOR) {
			auxlex += " " + token_actual["valor"];
			pair(Tipo.IDENTIFICADOR);
			if (token_actual["tipo"] == Tipo.PAREN_ABRIR) {
				auxlex += " " + token_actual["valor"];
				pair(Tipo.PAREN_ABRIR);
				PARAMETRO_ME();
				auxlex += " " + token_actual["valor"];
				pair(Tipo.PAREN_CERRAR);
			}
		}
		else if (token_actual["tipo"] == Tipo.CADENA) {
			auxlex += " " + token_actual["valor"];
			pair(Tipo.CADENA);
		}
		else if (token_actual["tipo"] == Tipo.CADENA_HTML) {
			auxlex += " " + token_actual["valor"];
			pair(Tipo.CADENA_HTML);
		}

	}
}



function CONDICION() {
	TC();
	CP();
}

function CP() {
	if (token_actual["tipo"] == Tipo.OPERADOR_RELACIONAL) {
		pair(Tipo.OPERADOR_RELACIONAL);
		TC();
		CP();
	} else {
		//epsilon
	}

}

function TC() {
	FC();
	TCP();
}

function TCP() {
	if (token_actual["tipo"] == Tipo.OPERADOR_LOGICO) {
		pair(Tipo.OPERADOR_LOGICO);
		FC();
		TCP();
	} else {
		//epsilon
	}
}

function FC() {
	NOT();
	if (token_actual["tipo"] == Tipo.IDENTIFICADOR) {
		pair(Tipo.IDENTIFICADOR);
		if (token_actual["tipo"] == Tipo.PAREN_ABRIR) {
			pair(Tipo.PAREN_ABRIR);
			PARAMETRO_ME();
			pair(Tipo.PAREN_CERRAR);
		}
	}
	else if (token_actual["tipo"] == Tipo.CADENA) {
		pair(Tipo.CADENA);
	}
	else if (token_actual["tipo"] == Tipo.CADENA_HTML) {
		pair(Tipo.CADENA_HTML);
	}
	else if (token_actual["tipo"] == Tipo.PAREN_ABRIR) {
		pair(Tipo.PAREN_ABRIR);
		CONDICION();
		pair(Tipo.PAREN_CERRAR);
	}
}

function PARAMETRO_ME() {
	if (token_actual["tipo"] == Tipo.IDENTIFICADOR) {
		EXP();
		MAS_PARME();
	} else {
		//epsilon
	}
}

function MAS_PARME() {
	if (token_actual["tipo"] == Tipo.COMA) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.COMA);
		EXP();
		MAS_PARME();
	} else {
		//epsilon
	}
}

function PARAMETRO_MEC() {
	if (token_actual["tipo"] == Tipo.IDENTIFICADOR) {
		CONDICION();
		MAS_PARMEC();
	} else {
		//epsilon
	}
}

function MAS_PARMEC() {
	if (token_actual["tipo"] == Tipo.COMA) {
		pair(Tipo.COMA);
		CONDICION();
		MAS_PARMEC();
	} else {
		//epsilon
	}
}

function NOT() {
	if (token_actual["valor"] == "!") {
		pair(Tipo.OPERADOR_LOGICO);
		NOT();
	} else {
		//epsilon
	}
}

function METODO() {
	pair(Tipo.VOID);
	traduccion = traduccion + "def " + token_actual["valor"];
	pair(Tipo.IDENTIFICADOR);
	traduccion = traduccion + token_actual["valor"];
	pair(Tipo.PAREN_ABRIR);
	PARAMETRO();
	traduccion = traduccion + " " + auxlex;
	auxlex = "";
	traduccion = traduccion + token_actual["valor"];
	pair(Tipo.PAREN_CERRAR);
	traduccion += ":\n";
	contador_tab++;
	pair(Tipo.LLAVE_ABRIR);
	CUERPO_METODO();
	if (token_actual["valor"] == "return") {
		traduccion += '\t' + "return";
		pair(Tipo.RETURN);
		traduccion += auxlex + "\n" + "\n";
		auxlex = "";
		pair(Tipo.PUNTO_COMA);
	}
	pair(Tipo.LLAVE_CERRAR);
	contador_tab--;
	CLASS();
}

function MOD_ACCESO() {
	pair(Tipo.MOD_ACCESO);
	if (token_actual["tipo"] == Tipo.TIPO_DATO) {
		DECLARACION();
	} else if (token_actual["tipo"] == Tipo.VOID) {
		METODO();
	}
}

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\                                     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////        TIPOS DE OPERACIONES         /////////////////////////////////// 
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\                                     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/


function EXP() {
	T();
	EP();
}

function EP() {
	if (token_actual["tipo"] == Tipo.SIGNO_MAS) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.SIGNO_MAS);
		T();
		EP();
	}
	else if (token_actual["tipo"] == Tipo.SIGNO_MENOS) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.SIGNO_MENOS);
		T();
		EP();
	} else if (token_actual["tipo"] == Tipo.OPERADOR_RELACIONAL) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.OPERADOR_RELACIONAL);
		T();
		EP();
	}
	else {
		//epsilon
	}
}

function T() {
	F();
	TP();
}

function TP() {
	if (token_actual["tipo"] == Tipo.SIGNO_POR) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.SIGNO_POR);
		F();
		TP();
	}
	else if (token_actual["tipo"] == Tipo.SIGNO_DIV) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.SIGNO_DIV);
		F();
		TP();
	} else if (token_actual["tipo"] == Tipo.OPERADOR_LOGICO) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.OPERADOR_LOGICO);
		F();
		TP();
	} else {
		//epsilon
	}
}

function F() {
	if (token_actual["tipo"] == Tipo.PAREN_ABRIR) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.PAREN_ABRIR);
		EXP();
		auxlex += " " + token_actual["valor"];
		pair(Tipo.PAREN_CERRAR);
	} else {
		if (token_actual["tipo"] == Tipo.IDENTIFICADOR) {
			auxlex += " " + token_actual["valor"];
			pair(Tipo.IDENTIFICADOR);
			if (token_actual["tipo"] == Tipo.PAREN_ABRIR) {
				auxlex += " " + token_actual["valor"];
				pair(Tipo.PAREN_ABRIR);
				PARAMETRO_ME();
				auxlex += " " + token_actual["valor"];
				pair(Tipo.PAREN_CERRAR);
			}
		}
		else if (token_actual["tipo"] == Tipo.VALOR_INT) {
			auxlex += " " + token_actual["valor"];
			pair(Tipo.CADENA);
		}
		else if (token_actual["tipo"] == Tipo.VALOR_DOUBLE) {
			auxlex += " " + token_actual["valor"];
			pair(Tipo.CADENA_HTML);
		}

	}
}


/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\                                     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////        RECUPERACION DE ERRORES      /////////////////////////////////// 
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\                                     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/



function pair(tipo) {

	if (token_actual["tipo"] != tipo) {

		if (instruccion == false) {
			while ((token_actual["tipo"] != Tipo.LLAVE_CERRAR) && (token_actual["tipo"] != Tipo.ULTIMO)) {
				resultado_sintactico.push(token_actual);
				pos++;
				token_actual = flujo_tokens[pos];
			}
			if (token_actual["tipo"] == Tipo.LLAVE_CERRAR) {
				pos++;
				token_actual = flujo_tokens[pos];
			}
		} else {
			while (token_actual["valor"] != ";" && token_actual["tipo"] != Tipo.ULTIMO) {
				resultado_sintactico.push(token_actual);
				pos++;
				token_actual = flujo_tokens[pos];
			}
			if (token_actual["tipo"] == Tipo.PUNTO_COMA) {
				pos++;
				token_actual = flujo_tokens[pos];
			}
			instruccion == false;
		}
		if (metodo == true) {
			CUERPO_METODO();
		} else {
			CUERPO();
		}
	} else {
		if (token_actual["tipo"] != Tipo.ULTIMO) {
			resultado_tokens.push(token_actual);
			pos++;
			token_actual = flujo_tokens[pos];
		}
	}
}

