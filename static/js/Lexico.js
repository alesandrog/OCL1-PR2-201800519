/*
    Universidad de San Carlos de Guatemala
    Facultad de Ingenieria
    Ingenieria en Ciencias y Sistemas 
    Organizacion de Lenguajes y Compiladores 1 - 2020

    Desarrollado por Alesandro Gonzalez 
*/



//Vector general de tokens
let flujo_tokens = [];
let errores_lexicos = [];
let auxlex = "";
let actual = 0;
let fila = 0;
let columna = 0;
let entrada = '';
let aux_html = "";
let texto_html = "";


function analizador_lexico() {
    modal();
    var editor = ace.edit("editor");
    entrada = editor.getValue();
    entrada = entrada + '#';
    let t_actual = "";
    let i = 0;

    for (i = 0; i < entrada.length; i++) {
        t_actual = entrada[i];


        switch (actual) {

            case 0:

                if (t_actual == ' ') {
                    actual = 0;
                    columna++;
                } else if (t_actual == '\n') {
                    actual = 0;
                    fila++;
                    columna = 0;
                } else if (t_actual == '\t') {
                    actual = 0;
                    columna++;
                } else if (t_actual == '{') {
                    auxlex += t_actual;
                    columna++;
                    validar_token(Tipo.LLAVE_ABRIR);
                } else if (t_actual == '}') {
                    auxlex += t_actual;
                    columna++;
                    validar_token(Tipo.LLAVE_CERRAR);
                }
                else if (t_actual == '(') {
                    auxlex += t_actual;
                    columna++;
                    validar_token(Tipo.PAREN_ABRIR);
                }
                else if (t_actual == ')') {
                    auxlex += t_actual;
                    columna++;
                    validar_token(Tipo.PAREN_CERRAR);
                }
                else if (t_actual == '[') {
                    auxlex += t_actual;
                    columna++;
                    validar_token(Tipo.CORCHETE_ABRIR);
                }
                else if (t_actual == ']') {
                    auxlex += t_actual;
                    columna++;
                    validar_token(Tipo.CORCHETE_CERRAR);
                }
                else if (t_actual == '<') {
                    auxlex += t_actual;
                    actual = 1;
                    columna++;
                }
                else if (t_actual == '>') {
                    auxlex += t_actual;
                    actual = 1;
                    columna++;
                }
                else if (t_actual == '!') {
                    auxlex += t_actual;
                    actual = 11;
                    columna++;
                }
                else if (t_actual == '=') {
                    auxlex += t_actual;
                    actual = 1;
                    columna++;
                }
                else if (t_actual == '"') {
                    //Inicio de cadena
                    actual = 2
                    columna++;
                }
                else if (t_actual == '/') {
                    auxlex += t_actual;
                    actual = 3;
                    columna++;
                }
                else if (t_actual == '|') {
                    auxlex += t_actual;
                    actual = 8;
                    columna++;
                }
                else if (t_actual == '&') {
                    auxlex += t_actual;
                    actual = 10;
                    columna++;
                }
                else if (t_actual == '+') {
                    auxlex += t_actual;
                    columna++;
                    actual = 14;

                }
                else if (t_actual == '-') {
                    auxlex += t_actual;
                    columna++;
                    actual = 15;
                }
                else if (t_actual == '*') {
                    auxlex += t_actual;
                    columna++;
                    validar_token(Tipo.SIGNO_POR);
                }
                else if (t_actual == ',') {
                    auxlex += t_actual;
                    columna++;
                    validar_token(Tipo.COMA);
                }
                else if (t_actual == ':') {
                    auxlex += t_actual;
                    columna++;
                    validar_token(Tipo.DOS_PUNTOS);
                }
                else if (t_actual == ';') {
                    auxlex += t_actual;
                    columna++;
                    validar_token(Tipo.PUNTO_COMA);
                }
                else if (t_actual == '.') {
                    auxlex += t_actual;
                    columna++;
                    validar_token(Tipo.PUNTO);
                }
                else if (t_actual == '\'') {
                    actual = 9;
                    columna++;
                } else {

                    if (entrada.charCodeAt(i) > 64 && entrada.charCodeAt(i) < 91) {
                        auxlex += t_actual;
                        actual = 7;
                        columna++;
                    }
                    else if (entrada.charCodeAt(i) > 96 && entrada.charCodeAt(i) < 123) {
                        auxlex += t_actual;
                        actual = 7;
                        columna++;
                    }
                    else if (entrada.charCodeAt(i) > 47 && entrada.charCodeAt(i) < 58) {
                        auxlex += t_actual;
                        actual = 12;
                        columna++;
                    } else {

                        if (i == entrada.length - 1 && t_actual == '#') {
                            auxlex += t_actual;
                            columna++;
                            validar_token(Tipo.ULTIMO);
                        } else {
                            auxlex += t_actual;
                            columna++;
                            validar_error(Tipo.ERROR);
                        }
                    }

                }
                break;


            case 1:
                if (t_actual == '=') {
                    auxlex += t_actual;
                    columna++;
                    validar_token(Tipo.OPERADOR_RELACIONAL);
                } else {
                    i = i - 1;
                    validar_token(Tipo.OPERADOR_RELACIONAL)
                }
                break;

            case 2:
                if (t_actual != '\"') {
                    auxlex += t_actual;
                    actual = 2;
                    columna++;
                } else {
                    validar_token(Tipo.CADENA);
                }
                break;
            case 3:
                if (t_actual == '/') {
                    auxlex += t_actual;
                    validar_token(Tipo.INICIO_COMENS);
                    actual = 4;
                    columna++;
                }
                else if (t_actual == '*') {
                    auxlex += t_actual;
                    validar_token(Tipo.INICIO_COMENM);
                    actual = 5;
                    columna++;
                }
                else {
                    validar_token(Tipo.SIGNO_DIV);
                    i = i - 1;
                }
                break;
            case 4:
                if (t_actual != '\n') {
                    auxlex += t_actual;
                    actual = 4;
                } else {
                    validar_token(Tipo.COMENTARIO_S);
                }
                break;
            case 5:
                if (t_actual != '*') {
                    auxlex += t_actual;
                    actual = 5;
                    columna++;
                } else {
                    actual = 6;
                }
                break;

            case 6:
                if (t_actual == '/') {
                    columna++;
                    validar_token(Tipo.COMENTARIO_M);
                    columna++;
                    columna++;
                    auxlex = "*/";
                    validar_token(Tipo.FIN_COMENM);
                } else {
                    auxlex += t_actual;
                    actual = 5;
                    columna++;
                }
                break;

            case 7:
                if (entrada.charCodeAt(i) > 64 && entrada.charCodeAt(i) < 91) {
                    auxlex += t_actual;
                    actual = 7;
                    columna++;
                }
                else if (entrada.charCodeAt(i) > 96 && entrada.charCodeAt(i) < 123) {
                    auxlex += t_actual;
                    actual = 7;
                    columna++;
                }
                else if (entrada.charCodeAt(i) > 47 && entrada.charCodeAt(i) < 58) {
                    auxlex += t_actual;
                    actual = 7;
                    columna++;
                } else if (t_actual == '_') {
                    auxlex += t_actual;
                    actual = 7;
                    columna++;
                } else {

                    i = i - 1;
                    validar_reservada();

                }
                break;

            case 8:
                if (t_actual == '|') {
                    columna++;
                    auxlex += t_actual;
                    validar_token(Tipo.OPERADOR_LOGICO);
                } else {
                    validar_error(Tipo.ERROR);
                    i = i - 1;
                }
                break;

            case 9:
                if (t_actual != '\'') {
                    columna++;
                    auxlex += t_actual;
                } else {
                    if (auxlex.length > 1) {

                        for (let n = 0; n < auxlex.length; n++) {
                            if (auxlex[n] == '\"') {
                                aux_html += "^";

                            } else if (auxlex[n] == '\\') {

                            }
                            else {
                                aux_html += auxlex[n];
                            }


                        }
                        texto_html += aux_html + '\n';
                        validar_token(Tipo.CADENA_HTML);
                    } else {
                        validar_token(Tipo.VALOR_CHAR);
                    }

                }
                break;

            case 10:
                if (t_actual == '&') {
                    columna++;
                    auxlex += t_actual;
                    validar_token(Tipo.OPERADOR_LOGICO);
                } else {
                    validar_error(Tipo.ERROR);
                    i = i - 1;
                }
                break;

            case 11:
                if (t_actual == '=') {
                    columna++;
                    auxlex += t_actual;
                    validar_token(Tipo.OPERADOR_RELACIONAL);
                } else {
                    i = i - 1;
                    validar_token(Tipo.OPERADOR_LOGICO);
                }
                break;

            case 12:
                if (entrada.charCodeAt(i) > 47 && entrada.charCodeAt(i) < 58) {
                    auxlex += t_actual;
                    actual = 12;
                    columna++;
                } else if (t_actual == '.') {
                    auxlex += t_actual;
                    actual = 13;
                    columna++;
                } else {
                    i = i - 1;
                    validar_token(Tipo.VALOR_INT);
                }
                break;

            case 13:
                if (entrada.charCodeAt(i) > 47 && entrada.charCodeAt(i) < 58) {
                    auxlex += t_actual;
                    actual = 12;
                    columna++;
                } else {
                    i = i - 1;
                    validar_token(Tipo.VALOR_DOUBLE);
                }
                break;

            case 14:
                if (t_actual == '+') {
                    auxlex += t_actual;
                    columna++;
                    validar_token(Tipo.MAS_DOBLE);
                } else {
                    i = i - 1;
                    validar_token(Tipo.SIGNO_MAS);
                }
                break;

            case 15:
                if (t_actual == '-') {
                    auxlex += t_actual;
                    columna++;
                    validar_token(Tipo.MENOS_DOBLE);
                } else {
                    i = i - 1;
                    validar_token(Tipo.SIGNO_MENOS);
                }
                break;

        }
    }


    console.log(flujo_tokens);
    console.log(errores_lexicos);

    parser();
    console.log(resultado_sintactico);

    console.log(resultado_tokens);

    for (let i = 0; i < resultados_switch.length; i++) {
        traduccion += resultados_switch[i] + "\n";
    }
    console.log(traduccion);

    let tbl1 = document.getElementById("tbl_simbolos");
    let filas = "";
    for (let i = 0; i < tabla_simbolos.length; i++) {
        filas += "<tr ><td>" + tabla_simbolos[i]["identificador"] + "</td>" + "<td>" + tabla_simbolos[i]["tipo"] + "<td>" + tabla_simbolos[i]["fila"] + "</td>" + "</tr>";
    }
    tbl1.innerHTML = filas;
    console.log(texto_html);

    let edht = document.getElementById("res_html");
    edht.innerHTML = texto_html;
    hljs.highlightBlock($('code').get(0));
    document.querySelectorAll('code').forEach(function (element) {
        element.innerHTML = element.innerHTML.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    });


    let con_errores = 0;

    let tbl2 = document.getElementById("tbl_errores");
    let filas_e = "";
    for (let i = 0; i < errores_lexicos.length; i++) {
        con_errores++;
        filas_e += "<tr ><td>" + con_errores + "</td>" +"<td>" + errores_lexicos[i]["valor"] + "</td>" + "<td>" + errores_lexicos[i]["tipo"] + "<td>" + errores_lexicos[i]["fila"] + "</td>" + "<td>" + errores_lexicos[i]["columna"] + "<td>" + errores_lexicos[i]["descripcion"] + "</td>" + "</td>" + "</tr>";
    }
    for (let i = 0; i < resultado_sintactico.length; i++) {
        con_errores++;
        filas_e += "<tr ><td>" + con_errores + "</td>"+"<td>" + resultado_sintactico[i]["valor"] + "</td>" + "<td>" + resultado_sintactico[i]["tipo"] + "<td>" + resultado_sintactico[i]["fila"] + "</td>" + "<td>" + resultado_sintactico[i]["columna"] + "<td>" + resultado_sintactico[i]["descripcion"] + "</td>" + "</td>" + "</tr>";
    }
    tbl2.innerHTML = filas_e;

    //console.log(flujo_tokens[0]["valor"]);
    //console.info(flujo_tokens[0]["valor"] == t["valor"]);


    let tr = "<pre><code>" + traduccion + "</code></pre>";
    let edpy = document.getElementById("editor-python");
    edpy.innerHTML = tr;
    hljs.highlightBlock($('code').get(0));

    analizador_html();



}


function validar_reservada() {

    if (auxlex == "string" || auxlex == "String" || auxlex == "int" || auxlex == "bool" || auxlex == "char" || auxlex == "double" || auxlex == "Double") {
        let t = new Token(Tipo.TIPO_DATO, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    } else if (auxlex == "void") {
        let t = new Token(Tipo.VOID, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    } else if (auxlex == "Console") {
        let t = new Token(Tipo.CONSOLE, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    }
    else if (auxlex == "WriteLine") {
        let t = new Token(Tipo.WRITELINE, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    } else if (auxlex == "Write") {
        let t = new Token(Tipo.WRITE, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    } else if (auxlex == "class") {
        let t = new Token(Tipo.RESERVADA_CLASS, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    } else if (auxlex == "return") {
        let t = new Token(Tipo.RETURN, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    } else if (auxlex == "continue") {
        let t = new Token(Tipo.CONTINUE, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    } else if (auxlex == "break") {
        let t = new Token(Tipo.BREAK, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    } else if (auxlex == "default") {
        let t = new Token(Tipo.DEFAULT, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    }
    else if (auxlex == "true") {
        let t = new Token(Tipo.VALOR_BOOL, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    } else if (auxlex == "false") {
        let t = new Token(Tipo.VALOR_BOOL, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    }
    else if (auxlex == "if") {
        let t = new Token(Tipo.RESERVADA_IF, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    }
    else if (auxlex == "else") {
        let t = new Token(Tipo.RESERVADA_ELSE, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    }
    else if (auxlex == "do") {
        let t = new Token(Tipo.RESERVADA_DO, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    }
    else if (auxlex == "while") {
        let t = new Token(Tipo.RESERVADA_WHILE, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    }
    else if (auxlex == "switch") {
        let t = new Token(Tipo.RESERVADA_SWITCH, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    }
    else if (auxlex == "case") {
        let t = new Token(Tipo.RESERVADA_CASE, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    }
    else if (auxlex == "for") {
        let t = new Token(Tipo.RESERVADA_FOR, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    }
    else if (auxlex == "main") {
        let t = new Token(Tipo.RESERVADA_MAIN, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    }
    else if (auxlex == "Main") {
        let t = new Token(Tipo.RESERVADA_MAIN, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    }
    else {
        let t = new Token(Tipo.IDENTIFICADOR, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    }
}

function validar_token(tipo) {
    if (tipo != Tipo.CADENA_HTML) {
        let t = new Token(tipo, auxlex, fila, columna);
        flujo_tokens.push(t);
        actual = 0;
        auxlex = "";
    } else {
        let t = new Token(tipo, aux_html, fila, columna);
        aux_html = "";
        flujo_tokens.push(t);
        actual = 0;
    }



}

function validar_error() {
    let t = new Token("ERROR", auxlex, fila, columna);
    let error = { "tipo": "LEXICO", "fila": fila, "columna": columna, "descripcion": "Token desconocido", "valor": auxlex};
    errores_lexicos.push(error);
    actual = 0;
    auxlex = "";
}


function exists(valor) {


    for (let i = 0; i < flujo_tokens.length; i++) {
        if (flujo_tokens[i]["valor"] == valor) {
            return true;
        }
    }
    return false;
}

