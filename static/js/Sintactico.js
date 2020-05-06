let tabla_simbolos = [];
let resultado_sintactico = [];
let resultado_tokens = [];
let lista_iden = [];
let lista_switch = [];
let resultados_switch = [];

let contador_ciclos = 0;
let pos = 0;
let token_actual;
let salida = ";";
let traduccion = "";
let aux_traduccion = "";
let tipo_dato = "";
let contador_tab = 0;
let tipo_global = "";
let identificador_aux;
let contador_case = 1;
let string_switch = "";

/* */
let metodo = false;
let instruccion = false;
let parametro = false;
let ciclo = false;
let clase = false;
let iden_existe = false;

let variable = false;
let bool_switch = false;



function parser() {

	token_actual = flujo_tokens[pos];
	console.log("tokens");
	console.log(flujo_tokens);
	CUERPO();
}
/* -----------------------------------DEFINICIONES PARA CUERPO------------------------------------------ */

function CUERPO() {
	if (token_actual["tipo"] == Tipo.RESERVADA_CLASS) {
		pair(Tipo.RESERVADA_CLASS);
		pair(Tipo.IDENTIFICADOR);
		pair(Tipo.LLAVE_ABRIR);
		clase = true;
		CLASS();
		clase = false;
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


/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\                                     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////   DECLARACIONES DE USO GENERAL      /////////////////////////////////// 
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\                                     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

function LISTA_ID() {

	if (token_actual["tipo"] == Tipo.COMA) {
		pair(Tipo.COMA);
		let iden = { "valor": token_actual["valor"], "fila": token_actual["fila"] };
		lista_iden.push(iden);
		if (bool_switch == true) {
			lista_switch.push(iden);
		}
		pair(Tipo.IDENTIFICADOR);
		LISTA_ID();
	}
	else if (token_actual["valor"] == "=") {
		pair(Tipo.OPERADOR_RELACIONAL);
		EXP();
		for (let i = 0; i < lista_iden.length; i++) {
			if (i > 0) {
				for (let i = 0; i < contador_tab; i++) {
					traduccion += '\t';
				}
				let simbolo = { "tipo": tipo_global, "identificador": lista_iden[i]["valor"], "fila": lista_iden[i]["fila"] };
				tabla_simbolos.push(simbolo);
			}
			traduccion += "var " + lista_iden[i]["valor"] + " = " + auxlex + ";\n";
		}
	} else {
		console.log("lista iden");
		console.log(lista_iden);
		console.log(lista_iden[0]["valor"]);
		//epsilon
		if (tipo_dato == "int") {
			for (let i = 0; i < lista_iden.length; i++) {
				if (i > 0) {
					for (let i = 0; i < contador_tab; i++) {
						traduccion += '\t';
					}
					let simbolo = { "tipo": tipo_global, "identificador": lista_iden[i]["valor"], "fila": lista_iden[i]["fila"] };
					tabla_simbolos.push(simbolo);
				}
				traduccion += "var " + lista_iden[i]["valor"] + " = 0;\n";
			}
		} else if (tipo_dato == "string") {
			for (let i = 0; i < lista_iden.length; i++) {
				if (i > 0) {
					for (let i = 0; i < contador_tab; i++) {
						traduccion += '\t';
					}
					let simbolo = { "tipo": tipo_global, "identificador": lista_iden[i]["valor"], "fila": lista_iden[i]["fila"] };
					tabla_simbolos.push(simbolo);

				}
				traduccion += "var " + lista_iden[i]["valor"] + " = \"\";\n";
			}
		} else if (tipo_dato == "bool") {
			for (let i = 0; i < lista_iden.length; i++) {
				if (i > 0) {
					for (let i = 0; i < contador_tab; i++) {
						traduccion += '\t';
					}
					let simbolo = { "tipo": tipo_global, "identificador": lista_iden[i]["valor"], "fila": lista_iden[i]["fila"] };
					tabla_simbolos.push(simbolo);

				}
				traduccion += "var " + lista_iden[i]["valor"] + " = false;\n";
			}
		} else if (tipo_dato == "char") {
			if (i > 0) {
				for (let i = 0; i < contador_tab; i++) {
					traduccion += '\t';
				}
				let simbolo = { "tipo": tipo_global, "identificador": lista_iden[i]["valor"], "fila": lista_iden[i]["fila"] };
				tabla_simbolos.push(simbolo);

			}
			for (let i = 0; i < lista_iden.length; i++) {
				traduccion += "var " + lista_iden[i]["valor"] + " = ' ';\n";
			}
		} else if (tipo_dato == "double") {
			if (i > 0) {
				for (let i = 0; i < contador_tab; i++) {
					traduccion += '\t';
				}
				let simbolo = { "tipo": tipo_global, "identificador": lista_iden[i]["valor"], "fila": lista_iden[i]["fila"] };
				tabla_simbolos.push(simbolo);
			}
			for (let i = 0; i < lista_iden.length; i++) {
				traduccion += "var " + lista_iden[i]["valor"] + " = 0;\n";
			}
		}

	}
	lista_iden = [];
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
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\                                     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////   DECLARACIONES DENTRO DE CLASE     /////////////////////////////////// 
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\                                     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

/*-----------------------------------DEFINICIONES PARA CLASS------------------------------------------ */

function CLASS() {

	if (token_actual["tipo"] == Tipo.INICIO_COMENS) {
		COMENTARIO_S();
	}
	else if (token_actual["tipo"] == Tipo.INICIO_COMENM) {
		COMENTARIO_M();
	}
	else if (token_actual["tipo"] == Tipo.TIPO_DATO || token_actual["tipo"] == Tipo.IDENTIFICADOR) {
		DECLARACION();
		lista_iden = [];
	}
	else if (token_actual["tipo"] == Tipo.VOID) {
		metodo = true;
		pair(Tipo.VOID);
		if(token_actual["tipo"] == Tipo.RESERVADA_MAIN){
			MAIN();

		}else if(token_actual["tipo"] == Tipo.IDENTIFICADOR){
			METODO();
		} 

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
	traduccion += "#";
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
	if (token_actual["tipo"] == Tipo.TIPO_DATO) {
		variable = true;
		tipo_global = token_actual["valor"];
		tipo_dato = token_actual["valor"];
		pair(Tipo.TIPO_DATO);
	} else {
		variable = false;
	}
	identificador_aux = token_actual["valor"];
	let iden = { "valor": token_actual["valor"], "fila": token_actual["fila"] };
	lista_iden.push(iden);
	let simbolo = { "tipo": tipo_global, "identificador": token_actual["valor"], "fila": token_actual["fila"] };
	tabla_simbolos.push(simbolo);
	pair(Tipo.IDENTIFICADOR);
	TIPO_DECLARACION();
	lista_iden = [];
	variable = false;
	CLASS();
}

function TIPO_DECLARACION() {
	if (token_actual["tipo"] == Tipo.COMA) {
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
			traduccion = traduccion + "var " + identificador_aux + " =";
		} else {
			traduccion = traduccion + identificador_aux + " =";
		}
		instruccion = true;
		pair(Tipo.OPERADOR_RELACIONAL);
		EXP();
		traduccion += auxlex + ";\n";
		auxlex = "";
		variable = false;
		identificador_aux = "";
		pair(Tipo.PUNTO_COMA);
		instruccion = false;
	} else {
		if (variable == true) {
			if (tipo_dato == "int") {

				traduccion += "var " + identificador_aux + " = 0;\n";

			} else if (tipo_dato == "string") {


				traduccion += "var " + identificador_aux + " = \"\";\n";

			} else if (tipo_dato == "bool") {

				traduccion += "var " + identificador_aux + " = false;\n";

			} else if (tipo_dato == "char") {

				traduccion += "var " + identificador_aux + " = ' ';\n";

			} else if (tipo_dato == "double") {
				traduccion += "var " + identificador_aux + " = 0;\n";

			}
		} else {
			if (tipo_dato == "int") {

				traduccion += + identificador_aux + " = 0;\n";

			} else if (tipo_dato == "string") {


				traduccion += identificador_aux + " = \"\";\n";

			} else if (tipo_dato == "bool") {

				traduccion += identificador_aux + " = false;\n";

			} else if (tipo_dato == "char") {

				traduccion += identificador_aux + " = ' ';\n";

			} else if (tipo_dato == "double") {
				traduccion += identificador_aux + " = 0;\n";

			}
		}


		pair(Tipo.PUNTO_COMA);
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
	aumentar_tab();
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
	disminuir_tab();
	CLASS();
}


function MAIN() {
	traduccion = traduccion + "def " + token_actual["valor"];
	pair(Tipo.RESERVADA_MAIN);
	traduccion = traduccion + token_actual["valor"];
	pair(Tipo.PAREN_ABRIR);
	PARAMETRO();
	traduccion = traduccion + " " + auxlex;
	auxlex = "";
	traduccion = traduccion + token_actual["valor"];
	pair(Tipo.PAREN_CERRAR);
	traduccion += ":\n";
	aumentar_tab();
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
	disminuir_tab();
	traduccion += "if __name__ = \“__main__\”:\n\tmain()\n";
	CLASS();
}

function METODO() {
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
	aumentar_tab();
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
	disminuir_tab();
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
////////////////////////////////////////   DECLARACIONES DENTRO DE METODOS   /////////////////////////////////// 
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\                                     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

function CUERPO_METODO() {
	if (token_actual["tipo"] == Tipo.RESERVADA_IF) {
		IF();
	}
	else if (token_actual["tipo"] == Tipo.RESERVADA_FOR) {
		contador_ciclos++;
		FOR();
	}
	else if (token_actual["tipo"] == Tipo.RESERVADA_WHILE) {
		contador_ciclos++;
		WHILE();

	}
	else if (token_actual["tipo"] == Tipo.RESERVADA_SWITCH) {
		SWITCH();

	}
	else if (token_actual["tipo"] == Tipo.RESERVADA_DO) {
		contador_ciclos++;
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
	else if (token_actual["tipo"] == Tipo.BREAK) {
		if(contador_ciclos > 0){
			console.log(contador_ciclos);
			instruccion = true;
			print_tab();
			traduccion += "break\n";
			pair(Tipo.BREAK);
			pair(Tipo.PUNTO_COMA);
			instruccion = false;
			CUERPO_METODO();
		}
	}
	else if (token_actual["tipo"] == Tipo.CONTINUE) {
		if(contador_ciclos > 0){
			console.log(contador_ciclos);
			instruccion = true;
			print_tab();
			traduccion += "continue\n";
			pair(Tipo.CONTINUE);
			pair(Tipo.PUNTO_COMA);
			instruccion = false;
			CUERPO_METODO();
		}
	}
	
}

function COMENTARIO_SM() {
	pair(Tipo.INICIO_COMENS);
	traduccion += "#";
	traduccion = traduccion + token_actual["valor"] + "\n";
	pair(Tipo.COMENTARIO_S);
	CUERPO_METODO();
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

	print_tab();
	if (token_actual["tipo"] == Tipo.TIPO_DATO) {
		variable = true;
		tipo_global = token_actual["valor"];
		tipo_dato = token_actual["valor"];
		pair(Tipo.TIPO_DATO);
	} else {
		variable = false;
	}
	identificador_aux = token_actual["valor"];
	let iden = { "valor": token_actual["valor"], "fila": token_actual["fila"] };
	lista_iden.push(iden);
	if (bool_switch == true) {
		lista_switch.push(iden);
	}
	let simbolo = { "tipo": tipo_global, "identificador": token_actual["valor"], "fila": token_actual["fila"] };
	tabla_simbolos.push(simbolo);
	pair(Tipo.IDENTIFICADOR);
	TIPO_DECLARACION_M();
	lista_iden = [];
	variable = false;
	CUERPO_METODO();
}

function TIPO_DECLARACION_M() {
	if (token_actual["tipo"] == Tipo.COMA) {
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
			traduccion = traduccion + "var " + identificador_aux + " = ";
		} else {
			traduccion = traduccion + identificador_aux + " = ";
		}
		instruccion = true;
		pair(Tipo.OPERADOR_RELACIONAL);
		EXP();
		traduccion +=  auxlex + ";\n";
		auxlex = "";
		variable = false;
		identificador_aux = "";
		pair(Tipo.PUNTO_COMA);
		instruccion = false;
	} else {
		instruccion = true;
		if (variable == true) {
			if (tipo_dato == "int") {

				traduccion += "var " + identificador_aux + " = 0;\n";

			} else if (tipo_dato == "string") {


				traduccion += "var " + identificador_aux + " = \"\";\n";

			} else if (tipo_dato == "bool") {

				traduccion += "var " + identificador_aux + " = false;\n";

			} else if (tipo_dato == "char") {

				traduccion += "var " + identificador_aux + " = ' ';\n";

			} else if (tipo_dato == "double") {
				traduccion += "var " + identificador_aux + " = 0;\n";

			}
		} else {
			if (tipo_dato == "int") {

				traduccion += + identificador_aux + " = 0;\n";

			} else if (tipo_dato == "string") {


				traduccion += identificador_aux + " = \"\";\n";

			} else if (tipo_dato == "bool") {

				traduccion += identificador_aux + " = false;\n";

			} else if (tipo_dato == "char") {

				traduccion += identificador_aux + " = ' ';\n";

			} else if (tipo_dato == "double") {
				traduccion += identificador_aux + " = 0;\n";

			}
		}


		pair(Tipo.PUNTO_COMA);

		instruccion = false;
	}
}
function CONSOLE() {
	instruccion = true;
	pair(Tipo.CONSOLE);
	pair(Tipo.PUNTO);
	if (token_actual["tipo"] == Tipo.WRITE) {
		pair(Tipo.WRITE);
	} else if (token_actual["tipo"] == Tipo.WRITELINE) {
		pair(Tipo.WRITELINE);
	}
	pair(Tipo.PAREN_ABRIR);
	print_tab();
	EXP();
	traduccion += "print(" + auxlex + ");\n";
	auxlex = "";
	pair(Tipo.PAREN_CERRAR);
	pair(Tipo.PUNTO_COMA);
	instruccion = false;
	CUERPO_METODO();
}

function print_tab() {
	for (let i = 0; i < contador_tab; i++) {
		traduccion += '\t';
	}
}

function aumentar_tab() {
	contador_tab++;
}

function disminuir_tab() {
	contador_tab--;
}

function IF() {
	ciclo = true;
	print_tab();
	aumentar_tab();
	pair(Tipo.RESERVADA_IF);
	pair(Tipo.PAREN_ABRIR);
	traduccion += "if ";
	EXP();
	traduccion += auxlex + " :\n";
	auxlex = "";
	pair(Tipo.PAREN_CERRAR);
	pair(Tipo.LLAVE_ABRIR);
	CUERPO_METODO();
	pair(Tipo.LLAVE_CERRAR);
	disminuir_tab();
	ELSE();
	ciclo = false;
	CUERPO_METODO();
}

function ELSE() {
	if (token_actual["tipo"] == Tipo.RESERVADA_ELSE) {
		pair(Tipo.RESERVADA_ELSE);
		TIPO_ELSE();
	} else {
		//epsilon
	}
}

function TIPO_ELSE() {
	if (token_actual["tipo"] == Tipo.RESERVADA_IF) {
		print_tab();
		traduccion += "elif ";
		aumentar_tab();
		pair(Tipo.RESERVADA_IF);
		pair(Tipo.PAREN_ABRIR);
		EXP();
		traduccion += auxlex + " :\n";
		auxlex = "";
		pair(Tipo.PAREN_CERRAR);
		pair(Tipo.LLAVE_ABRIR);
		CUERPO_METODO();
		pair(Tipo.LLAVE_CERRAR);
		disminuir_tab();
		ELSE();
	}
	else if (token_actual["tipo"] == Tipo.LLAVE_ABRIR) {
		print_tab();
		traduccion += "else:\n";
		aumentar_tab();
		pair(Tipo.LLAVE_ABRIR);
		CUERPO_METODO();
		pair(Tipo.LLAVE_CERRAR);
		disminuir_tab();
	}
	else {
		//epsilon
	}
}


function FOR() {
	ciclo = true;
	print_tab();
	pair(Tipo.RESERVADA_FOR);
	pair(Tipo.PAREN_ABRIR);
	if (token_actual["tipo"] == Tipo.TIPO_DATO) {
		traduccion = traduccion + "for " + token_actual["valor"] + " in range(";
		pair(Tipo.TIPO_DATO);
		pair(Tipo.IDENTIFICADOR);
	}
	else if (token_actual["tipo"] == Tipo.IDENTIFICADOR) {
		traduccion = traduccion + "for " + token_actual["valor"] + " in range(";
		pair(Tipo.IDENTIFICADOR);
	}
	if (token_actual["valor"] == "=") {
		pair(Tipo.OPERADOR_RELACIONAL);
	}
	EXPI();
	traduccion = traduccion + auxlex + " , ";
	auxlex = "";
	pair(Tipo.PUNTO_COMA);
	EXPI();
	auxlex = "";
	pair(Tipo.OPERADOR_RELACIONAL);
	EXPI();
	traduccion += auxlex;
	auxlex = "";
	pair(Tipo.PUNTO_COMA);
	INCREMENTO();
	pair(Tipo.PAREN_CERRAR);
	pair(Tipo.LLAVE_ABRIR);
	aumentar_tab();
	CUERPO_METODO();
	disminuir_tab();
	pair(Tipo.LLAVE_CERRAR);
	ciclo = false;
	contador_ciclos = contador_ciclos -1;
	CUERPO_METODO();
}

function INCREMENTO() {
	pair(Tipo.IDENTIFICADOR);
	if (token_actual["tipo"] == Tipo.MAS_DOBLE) {
		traduccion += "):\n";
		pair(Tipo.MAS_DOBLE);
	}
	else if (token_actual["tipo"] == Tipo.MENOS_DOBLE) {
		traduccion += ",-1 ):\n";
		pair(Tipo.MENOS_DOBLE);
	}
	else if (token_actual["tipo"] == Tipo.MAS_IGUAL) {
		pair(Tipo.MAS_IGUAL);
		EXPI();
	}
	else if (token_actual["tipo"] == Tipo.MENOS_IGUAL) {
		pair(Tipo.MENOS_IGUAL);
		EXPI();
	}
	else if (token_actual["valor"] == "=") {
		pair(Tipo.OPERADOR_LOGICO);
		EXP();
	}
}


function WHILE() {
	ciclo = true;
	print_tab();
	pair(Tipo.RESERVADA_WHILE);
	pair(Tipo.PAREN_ABRIR);
	EXP();
	traduccion += "while " + auxlex + " :\n";
	auxlex = "";
	pair(Tipo.PAREN_CERRAR);
	pair(Tipo.LLAVE_ABRIR);
	aumentar_tab();
	CUERPO_METODO();
	disminuir_tab();
	pair(Tipo.LLAVE_CERRAR);
	ciclo = false;
	contador_ciclos = contador_ciclos -1;
	CUERPO_METODO();
}

function DO() {
	ciclo = true;
	print_tab();
	pair(Tipo.RESERVADA_DO);
	pair(Tipo.LLAVE_ABRIR);
	traduccion += "while True: \n";
	aumentar_tab();
	CUERPO_METODO();
	pair(Tipo.LLAVE_CERRAR);
	ciclo = false;
	instruccion = true;
	pair(Tipo.RESERVADA_WHILE);
	pair(Tipo.PAREN_ABRIR);
	EXP();
	print_tab();
	traduccion += "if(" + auxlex + "):\n";
	aumentar_tab();
	print_tab();
	traduccion += "break;\n";
	auxlex = "";
	disminuir_tab();
	disminuir_tab();
	pair(Tipo.PAREN_CERRAR);
	pair(Tipo.PUNTO_COMA);
	instruccion = false;
	contador_ciclos = contador_ciclos -1;
	CUERPO_METODO();
}

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\                                     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////        TRADUCCION DE SWITCH         /////////////////////////////////// 
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\                                     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

function SWITCH() {
	string_switch += "def switch(case, ";
	bool_switch = true;
	pair(Tipo.RESERVADA_SWITCH);
	pair(Tipo.PAREN_ABRIR);
	pair(Tipo.IDENTIFICADOR);
	pair(Tipo.PAREN_CERRAR);
	pair(Tipo.LLAVE_ABRIR);
	CASE();
	DEFAULT();
	for (let i = 0; i < lista_switch.length; i++) {
		if (i < lista_switch.length - 1) {
			string_switch += lista_switch[i] + ",";
		} else {
			string_switch += lista_switch[i] + "):\n";
		}
	}
	string_switch += '\t' + "switcher={\n";
	string_switch += aux_traduccion + '\n';
	string_switch += "\t}\n";
	resultados_switch.push(string_switch);
	string_switch = "";
	aux_traduccion = "";
	contador_case = 1;
	lista_switch = [];
	pair(Tipo.LLAVE_CERRAR);
	bool_switch = false;
	CUERPO_METODO();
}

function CASE() {
	if (token_actual["tipo"] == Tipo.RESERVADA_CASE) {
		pair(Tipo.RESERVADA_CASE);
		contador_case++;
		aux_traduccion += "\t\t" + token_actual["valor"] + ": ";
		if (token_actual["tipo"] == Tipo.IDENTIFICADOR) {
			pair(Tipo.IDENTIFICADOR);
		}
		else if (token_actual["tipo"] == Tipo.VALOR_INT) {
			pair(Tipo.VALOR_INT);
		}
		else if (token_actual["tipo"] == Tipo.VALOR_DOUBLE) {
			pair(Tipo.VALOR_DOUBLE);
		}
		else if (token_actual["tipo"] == Tipo.VALOR_CHAR) {
			pair(Tipo.VALOR_CHAR);
		}
		else if (token_actual["tipo"] == Tipo.VALOR_BOOL) {
			pair(Tipo.VALOR_BOOL);
		}

		pair(Tipo.DOS_PUNTOS);
		CUERPO_CASE();
		if (token_actual["tipo"] == Tipo.BREAK) {
			pair(Tipo.BREAK);
			pair(Tipo.PUNTO_COMA);
		}
		aux_traduccion += '\n';
		CASE();
	} else {
		//epsilon
	}
}

function CONSOLE_C() {
	instruccion = true;
	pair(Tipo.CONSOLE);
	pair(Tipo.PUNTO);
	if (token_actual["tipo"] == Tipo.WRITE) {
		pair(Tipo.WRITE);
	} else if (token_actual["tipo"] == Tipo.WRITELINE) {
		pair(Tipo.WRITELINE);
	}
	pair(Tipo.PAREN_ABRIR);
	print_tab();
	EXP();
	aux_traduccion += "print(" + auxlex + "),";
	auxlex = "";
	pair(Tipo.PAREN_CERRAR);
	pair(Tipo.PUNTO_COMA);
	instruccion = false;
	CUERPO_CASE();
}

function DEFAULT() {
	instruccion = true;
	if (token_actual["tipo"] == Tipo.DEFAULT) {
		pair(Tipo.DEFAULT);
		pair(Tipo.DOS_PUNTOS);
		aux_traduccion += "\t\t" + contador_case + ": ";
		CUERPO_CASE();
		if (token_actual["tipo"] == Tipo.BREAK) {
			pair(Tipo.BREAK);
			pair(Tipo.PUNTO_COMA);
		}
	} else {
		//epsilon
	}
	instruccion = false;
}

function CUERPO_CASE() {
	if (token_actual["tipo"] == Tipo.TIPO_DATO || token_actual["tipo"] == Tipo.IDENTIFICADOR) {
		DECLARACION_MC();
	} else if (token_actual["tipo"] == Tipo.CONSOLE) {
		CONSOLE_C();
	}
}
function DECLARACION_MC() {

	if (token_actual["tipo"] == Tipo.TIPO_DATO) {
		variable = true;
		tipo_global = token_actual["valor"];
		pair(Tipo.TIPO_DATO);
	}
	identificador_aux = token_actual["valor"];
	let iden = { "valor": token_actual["valor"], "fila": token_actual["fila"] };
	lista_iden.push(iden);
	let simbolo = { "tipo": tipo_global, "identificador": token_actual["valor"], "fila": token_actual["fila"] };
	tabla_simbolos.push(simbolo);
	verificar_existe(identificador_aux);
	if (iden_existe == false) {
		lista_switch.push(identificador_aux);
	}
	pair(Tipo.IDENTIFICADOR);
	TIPO_DECLARACION_MC();
	CUERPO_CASE();
}

function TIPO_DECLARACION_MC() {
	if (token_actual["tipo"] == Tipo.COMA) {
		console.log("lista");
		console.log(lista_iden);
		instruccion = true;
		LISTA_IDC();
		variable = false;
		identificador_aux = "";
		aux_traduccion = aux_traduccion + ",";
		auxlex = "";
		pair(Tipo.PUNTO_COMA);
		lista_iden = [];
		instruccion = false;
	}
	else if (token_actual["valor"] == "=") {
		if (variable == true) {
			aux_traduccion = aux_traduccion + "var " + identificador_aux + " ";
		} else {
			aux_traduccion = aux_traduccion + identificador_aux + " ";
		}
		instruccion = true;
		aux_traduccion += token_actual["valor"];
		pair(Tipo.OPERADOR_RELACIONAL);
		EXP();
		aux_traduccion = aux_traduccion + " " + auxlex;
		auxlex = "";
		variable = false;
		identificador_aux = "";
		aux_traduccion += ",";
		pair(Tipo.PUNTO_COMA);
		instruccion = false;
	} else {
		//epsilon
	}
}

function LISTA_IDC() {

	if (token_actual["tipo"] == Tipo.COMA) {
		pair(Tipo.COMA);
		let iden = { "valor": token_actual["valor"], "fila": token_actual["fila"] };
		lista_iden.push(iden);
		verificar_existe(iden["valor"]);
		if (iden_existe == false) {
			lista_switch.push(iden["valor"]);
		}
		pair(Tipo.IDENTIFICADOR);
		LISTA_IDC();
	}
	else if (token_actual["valor"] == "=") {
		pair(Tipo.OPERADOR_RELACIONAL);
		EXP();
		for (let i = 0; i < lista_iden.length; i++) {
			if (i > 0) {
				let simbolo = { "tipo": tipo_global, "identificador": lista_iden[i]["valor"], "fila": lista_iden[i]["fila"] };
				tabla_simbolos.push(simbolo);
			}
			aux_traduccion += "var " + lista_iden[i]["valor"] + " = " + auxlex + ",";
		}
	} else {
		console.log("lista iden");
		console.log(lista_iden);
		console.log(lista_iden[0]["valor"]);
		//epsilon
		if (tipo_dato == "int") {
			for (let i = 0; i < lista_iden.length; i++) {
				if (i > 0) {

					let simbolo = { "tipo": tipo_global, "identificador": lista_iden[i]["valor"], "fila": lista_iden[i]["fila"] };
					tabla_simbolos.push(simbolo);
				}
				aux_traduccion += "var " + lista_iden[i]["valor"] + " = 0 , ";
			}
		} else if (tipo_dato == "string") {
			for (let i = 0; i < lista_iden.length; i++) {
				if (i > 0) {
					let simbolo = { "tipo": tipo_global, "identificador": lista_iden[i]["valor"], "fila": lista_iden[i]["fila"] };
					tabla_simbolos.push(simbolo);
				}
				aux_traduccion += "var " + lista_iden[i]["valor"] + " = \"\", ";
			}
		} else if (tipo_dato == "bool") {
			for (let i = 0; i < lista_iden.length; i++) {
				if (i > 0) {

					let simbolo = { "tipo": tipo_global, "identificador": lista_iden[i]["valor"], "fila": lista_iden[i]["fila"] };
					tabla_simbolos.push(simbolo);

				}
				aux_traduccion += "var " + lista_iden[i]["valor"] + " = false, ";
			}
		} else if (tipo_dato == "char") {

			for (let i = 0; i < lista_iden.length; i++) {
				if (i > 0) {
					let simbolo = { "tipo": tipo_global, "identificador": lista_iden[i]["valor"], "fila": lista_iden[i]["fila"] };
					tabla_simbolos.push(simbolo);

				}
				aux_traduccion += "var " + lista_iden[i]["valor"] + " = ' ',";
			}
		} else if (tipo_dato == "double") {
			for (let i = 0; i < lista_iden.length; i++) {
				if (i > 0) {
					let simbolo = { "tipo": tipo_global, "identificador": lista_iden[i]["valor"], "fila": lista_iden[i]["fila"] };
					tabla_simbolos.push(simbolo);
				}
				aux_traduccion += "var " + lista_iden[i]["valor"] + " = 0,";
			}
		}

	}
}

function verificar_existe(iden) {
	for (let n = 0; n < lista_switch.length; n++) {
		if (lista_switch[n] == iden) {
			iden_existe = true;
		}
	}
}

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\                                     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////        TIPOS DE OPERACIONES         /////////////////////////////////// 
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\                                     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

/*-----------------------------------------------OPERACIONES INT Y DOUBLE----------------------------------------- */
function EXPI() {
	TI();
	EPI();
}

function EPI() {
	if (token_actual["tipo"] == Tipo.SIGNO_MAS) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.SIGNO_MAS);
		TI();
		EPI();
	}
	else if (token_actual["tipo"] == Tipo.SIGNO_MENOS) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.SIGNO_MENOS);
		TI();
		EPI();
	}
	else {
		//epsilon
	}
}

function TI() {
	FI();
	TPI();
}

function TPI() {
	if (token_actual["tipo"] == Tipo.SIGNO_POR) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.SIGNO_POR);
		FI();
		TPI();
	}
	else if (token_actual["tipo"] == Tipo.SIGNO_DIV) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.SIGNO_DIV);
		FI();
		TPI();
	}
	else {
		//epsilon
	}
}

function FI() {
	if (token_actual["tipo"] == Tipo.PAREN_ABRIR) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.PAREN_ABRIR);
		EXPI();
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
			pair(Tipo.VALOR_INT);
		}
		else if (token_actual["tipo"] == Tipo.VALOR_DOUBLE) {
			auxlex += " " + token_actual["valor"];
			pair(Tipo.VALOR_DOUBLE);
		}
		else if (token_actual["tipo"] == Tipo.CADENA_HTML) {
			auxlex += " " + token_actual["valor"];
			pair(Tipo.CADENA_HTML);
		}
	}
}

/*----------------------------------------------------OPERACIONES STRING----------------------------------------- */


function EXPS() {
	TS();
	EPS();
}

function EPS() {
	if (token_actual["tipo"] == Tipo.SIGNO_MAS) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.SIGNO_MAS);
		TS();
		EPS();
	}
	else {
		//epsilon
	}
}

function TS() {
	FS();
}

function FS() {
	if (token_actual["tipo"] == Tipo.PAREN_ABRIR) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.PAREN_ABRIR);
		EXPS();
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
		else if (token_actual["tipo"] == Tipo.VALOR_INT) {
			auxlex += " " + token_actual["valor"];
			pair(Tipo.VALOR_INT);
		}
		else if (token_actual["tipo"] == Tipo.VALOR_DOUBLE) {
			auxlex += " " + token_actual["valor"];
			pair(Tipo.VALOR_DOUBLE);
		}
		else if (token_actual["tipo"] == Tipo.VALOR_CHAR) {
			auxlex += " " + token_actual["valor"];
			pair(Tipo.VALOR_CHAR);
		}
		else if (token_actual["tipo"] == Tipo.VALOR_DOUBLE) {
			auxlex += " " + token_actual["valor"];
			pair(Tipo.VALOR_DOUBLE);
		}

	}
}

/*----------------------------------------------------OPERACIONES CHAR----------------------------------------- */

function EXPC() {
	FC();
}

function FC() {
	if (token_actual["tipo"] == Tipo.PAREN_ABRIR) {
		auxlex += " " + token_actual["valor"];
		pair(Tipo.PAREN_ABRIR);
		EXPC();
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
		else if (token_actual["tipo"] == Tipo.VALOR_CHAR) {
			auxlex += " " + token_actual["valor"];
			pair(Tipo.CADENA);
		}
		else if (token_actual["tipo"] == Tipo.CADENA_HTML) {
			auxlex += " " + token_actual["valor"];
			pair(Tipo.CADENA_HTML);
		}

	}
}

/*----------------------------------------------------OPERACIONES BOOL------------------------------------------ */

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
	}
	else {
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
			auxlex += " " + "\"" + token_actual["valor"] + "\"";
			pair(Tipo.CADENA);
		}
		else if (token_actual["tipo"] == Tipo.CADENA_HTML) {
			auxlex += "\"segmento_html\"";
			pair(Tipo.CADENA_HTML);
		}
		else if (token_actual["tipo"] == Tipo.VALOR_INT) {
			auxlex += " " + token_actual["valor"];
			pair(Tipo.VALOR_INT);
		}
		else if (token_actual["tipo"] == Tipo.VALOR_DOUBLE) {
			auxlex += " " + token_actual["valor"];
			pair(Tipo.VALOR_DOUBLE);
		}
		else if (token_actual["tipo"] == Tipo.VALOR_CHAR) {
			auxlex += " \'" + token_actual["valor"] + "\'";
			pair(Tipo.VALOR_CHAR);
		}
		else if (token_actual["tipo"] == Tipo.VALOR_BOOL) {
			auxlex += " " + token_actual["valor"];
			pair(Tipo.VALOR_BOOL);
		}

	}
}


/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\                                     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////        DERIVACION GENERAL	         /////////////////////////////////// 
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\                                     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/


function GENERAL() {
	if (metodo == false) {
		if (token_actual["tipo"] == Tipo.INICIO_COMENS) {
			COMENTARIO_S();
		}
		else if (token_actual["tipo"] == Tipo.INICIO_COMENM) {
			COMENTARIO_M();
		}
		else if (token_actual["tipo"] == Tipo.TIPO_DATO || token_actual["tipo"] == Tipo.IDENTIFICADOR) {
			DECLARACION();
			lista_iden = [];
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
	} else {
		if (token_actual["tipo"] == Tipo.RESERVADA_IF) {
			IF();
		}
		else if (token_actual["tipo"] == Tipo.RESERVADA_FOR) {
			FOR();
		}
		else if (token_actual["tipo"] == Tipo.RESERVADA_WHILE) {
			WHILE();
		}
		else if (token_actual["tipo"] == Tipo.RESERVADA_SWITCH) {
			SWITCH();
		}
		else if (token_actual["tipo"] == Tipo.RESERVADA_DO) {
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

}


/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\                                     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////        RECUPERACION DE ERRORES      /////////////////////////////////// 
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\                                     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/



function pair(tipo) {

	if (token_actual["tipo"] != tipo) {
		let error = { "tipo": "SINTACTICO" , "fila": token_actual["fila"], "columna": token_actual["columna"], "descripcion": "Se esperaba " + tipo , "valor": token_actual["valor"]};
		resultado_sintactico.push(error);
		while ((token_actual["tipo"] != Tipo.LLAVE_CERRAR && token_actual["tipo"] != Tipo.ULTIMO && token_actual["tipo"] != Tipo.PUNTO_COMA && token_actual["tipo"] != Tipo.ULTIMO)) {
			console.log(token_actual);
			pos++;
			token_actual = flujo_tokens[pos];
		}
		if (token_actual["tipo"] != Tipo.ULTIMO) {

			pos++;
			token_actual = flujo_tokens[pos];
			GENERAL();
		}



	} else {
		if (token_actual["tipo"] != Tipo.ULTIMO) {
			resultado_tokens.push(token_actual);
			pos++;
			token_actual = flujo_tokens[pos];
		}
	}
}

function definir_salida() {

	if (llave == true || (parametro == false && instruccion == false)) {
		salida = "}";
	} else if (parametro == true || (llave == false && instruccion == false)) {
		salida = ")"
	} else if (instruccion == true || (llave == false && parametro == false)) {
		salida = ";";
	}
}