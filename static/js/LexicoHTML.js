let flujo_html = [];
let lexema = "";
let puntero = 0;
let f = 0;
let c = 0;
//let html = "<html><head><title>Mi Pagina</title> </head><body><h1>Practica 2</h1><div style=\"background: white;\"><h2>  Encabezado h2</h2><p> Esto es un bloque <br>de texto para <br>una prueba <br> </p> <br></div><div style=\"background: skyblue;\"> <h2> Llenar los campos </h2> <label>Ingrese su nombre</label><br><input><br><button> Mi boton </button><br></div></body></html>";
let html;

function analizador_html() {
    html = texto_html;
    console.log("achetemele");
    html = html + "#";
    console.log(html);
    let t_actual = "";
    let i = 0;
    for (i = 0; i < html.length; i++) {
        t_actual = html[i];

        switch (puntero) {
            case 0:
                if (t_actual == ' ') {
                    puntero = 0;
                    c++;
                } else if (t_actual == '\n') {
                    puntero = 0;
                    f++;
                    c = 0;
                } else if (t_actual == '\t') {
                    puntero = 0;
                    c++;
                } else if (t_actual == '<') {
                    c++;
                    lexema += t_actual;
                    validar_token2(TipoH.INICIO_ETIQUETA);
                }
                else if (t_actual == '>') {
                    c++;
                    lexema += t_actual;
                    validar_token2(TipoH.FIN_ETIQUETA);
                }
                else if (t_actual == ':') {
                    c++;
                    lexema += t_actual;
                    validar_token2(TipoH.DOS_PUNTOS);
                }
                else if (t_actual == '/') {
                    c++;
                    lexema += t_actual;
                    validar_token2(TipoH.DIAGONAL);
                }
                else if (t_actual == '=') {
                    c++;
                    lexema += t_actual;
                    validar_token2(TipoH.SIGNO_IGUAL);
                }
                else if (t_actual == '^') {
                    c++;
                    lexema += t_actual;
                    validar_token2(TipoH.COMILLA_DOBLE);
                } else {

                    if (html.charCodeAt(i) > 64 && html.charCodeAt(i) < 91) {
                        lexema += t_actual;
                        puntero = 1;
                        c++;
                    }
                    else if (html.charCodeAt(i) > 96 && html.charCodeAt(i) < 123) {
                        lexema += t_actual;
                        puntero = 1;
                        c++;
                    }
                    else if (html.charCodeAt(i) > 47 && html.charCodeAt(i) < 58) {
                        lexema += t_actual;
                        puntero = 1;
                        c++;
                    } else {
                        if (i == html.length - 1 && t_actual == '#') {
                            lexema += t_actual;
                            c++;
                            validar_token2(TipoH.ULTIMO);
                        } else {
                           // validar_error(TipoH.ERROR);
                        }
                    }
                }
                break;

            case 1:
                if (html.charCodeAt(i) > 64 && html.charCodeAt(i) < 91) {
                    lexema += t_actual;
                    puntero = 1;
                    c++;
                } else if (html.charCodeAt(i) > 96 && html.charCodeAt(i) < 123) {
                    lexema += t_actual;
                    puntero = 1;
                    c++;
                }
                else if (html.charCodeAt(i) > 47 && html.charCodeAt(i) < 58) {
                    lexema += t_actual;
                    puntero = 1;
                    c++;
                }
                else {

                    if (lexema == "html" || lexema == "head" || lexema == "body" || lexema == "title"
                    || lexema == "div" || lexema == "p" || lexema == "h1" || lexema == "h2" || lexema == "h3"
                    || lexema == "h4" || lexema == "input" || lexema == "button" || lexema == "style" 
                    || lexema == "background" || lexema == "br" || lexema == "label" || lexema == "yellow" 
                    || lexema == "green" || lexema == "white") {
                        i = i - 1;
                        validar_reservada2();                        
                    }else{
                        if (t_actual == ' ' || t_actual == '\n' || t_actual == '\t') {
                            lexema += t_actual;
                            puntero = 1;
                            c++;
                        }else{
                            i = i - 1;
                            validar_reservada2();
                        }
                    }

                }
                break;

            default:
                break;
        }
    }
    parser_html();
    console.log(flujo_html);
    console.log(salida_json);
    let edjs = document.getElementById("res_jei");
    edjs.innerHTML = salida_json;
    hljs.highlightBlock($('code').get(0));


}

function validar_reservada2() {
    if (lexema == "html") {
        validar_token2(TipoH.RESERVADA_HTML);
    }
    else if (lexema == "head") {
        validar_token2(TipoH.RESERVADA_HEAD);
    }
    else if (lexema == "body") {
        validar_token2(TipoH.RESERVADA_BODY);
    }
    else if (lexema == "title") {
        validar_token2(TipoH.RESERVADA_TITLE);
    }
    else if (lexema == "div") {
        validar_token2(TipoH.RESERVADA_DIV);
    }
    else if (lexema == "br") {
        validar_token2(TipoH.RESERVADA_BR);
    }
    else if (lexema == "p") {
        validar_token2(TipoH.RESERVADA_P);
    }
    else if (lexema == "h1" || lexema == "h2" || lexema == "h3" || lexema == "h4") {
        validar_token2(TipoH.RESERVADA_H);
    }
    else if (lexema == "button") {
        validar_token2(TipoH.RESERVADA_BUTTON);
    }
    else if (lexema == "label") {
        validar_token2(TipoH.RESERVADA_LABEL);
    }
    else if (lexema == "style") {
        validar_token2(TipoH.RESERVADA_STYLE);
    }
    else if (lexema == "p") {
        validar_token2(TipoH.RESERVADA_P);
    }
    else if (lexema == "input") {
        validar_token2(TipoH.RESERVADA_INPUT);
    }
    else if (lexema == "background") {
        validar_token2(TipoH.RESERVADA_BACKGROUND);
    }
    else if (lexema == "yellow" || lexema == "green" || lexema == "white" || lexema == "blue" || lexema == "red" || lexema == "skyblue") {
        validar_token2(TipoH.COLOR);
    } else {
        validar_token2(TipoH.TEXTO);
    }


}


function validar_token2(tipo) {

    let t = new Token(tipo, lexema, f, c);
    flujo_html.push(t);
    puntero = 0;
    lexema = "";
}





