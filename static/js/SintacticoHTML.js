let resultadosin_html = [];
let posi = 0;
let actual_t;
let tabs = 0;
let salida_json = "";

function parser_html() {
    actual_t = flujo_html[posi];
    ELEMENTOS();
}

function add_tab() {
    tabs++;
}

function delete_tab() {
    tabs--;
}

function imprimir_tab() {
    for (let i = 0; i < tabs; i++) {
        salida_json += '\t';
    }
}

function HTML() {
    salida_json += "\"HTML\":{\n";
    add_tab();
    emparejar(TipoH.RESERVADA_HTML);
    emparejar(TipoH.FIN_ETIQUETA);
    ELEMENTOS();
    delete_tab();
    imprimir_tab();
    salida_json += "}\n";
    emparejar(TipoH.INICIO_ETIQUETA);
    emparejar(TipoH.DIAGONAL);
    emparejar(TipoH.RESERVADA_HTML);
    emparejar(TipoH.FIN_ETIQUETA);
}

function ELEMENTOS() {
    emparejar(TipoH.INICIO_ETIQUETA);
    if (actual_t["tipo"] == TipoH.RESERVADA_HTML) {
        HTML();
    }
    else if (actual_t["tipo"] == TipoH.RESERVADA_DIV) {
        DIV();
    }
    else if (actual_t["tipo"] == TipoH.RESERVADA_H) {
        H();
    }
    else if (actual_t["tipo"] == TipoH.RESERVADA_P) {
        P();
    }
    else if (actual_t["tipo"] == TipoH.RESERVADA_LABEL) {
        LABEL();
    }
    else if (actual_t["tipo"] == TipoH.RESERVADA_HEAD) {
        HEAD();
    }
    else if (actual_t["tipo"] == TipoH.RESERVADA_INPUT) {
        INPUT();
    }
    else if (actual_t["tipo"] == TipoH.RESERVADA_BODY) {
        BODY();
    }
    else if (actual_t["tipo"] == TipoH.RESERVADA_BUTTON) {
        BUTTON();
    }
    else if (actual_t["tipo"] == TipoH.RESERVADA_TITLE) {
        TITLE();
    }
    else if (actual_t["tipo"] == TipoH.RESERVADA_BR) {
        BR();
    }
    else if (actual_t["tipo"] == TipoH.TEXTO) {
        TEXTO();
    }
    else {
        //epsilon
    }
}

function TITLE() {
    imprimir_tab();
    salida_json += "\"TITLE\":{\n";
    add_tab();
    emparejar(TipoH.RESERVADA_TITLE);
    emparejar(TipoH.FIN_ETIQUETA);
    TEXTO();
    delete_tab();
    imprimir_tab();
    salida += "},\n"
    emparejar(TipoH.INICIO_ETIQUETA);
    emparejar(TipoH.DIAGONAL);
    emparejar(TipoH.RESERVADA_TITLE);
    emparejar(TipoH.FIN_ETIQUETA);
    ELEMENTOS();
}

function TEXTO() {
    if (actual_t["tipo"] == TipoH.TEXTO) {
        imprimir_tab();
        salida_json += "TEXTO: \"" + actual_t["valor"] + "\"\n";
        emparejar(TipoH.TEXTO);
        TEXTO();
    }
    else {
        if (flujo_html[posi + 1]["tipo"] == TipoH.RESERVADA_BR) {
            emparejar(TipoH.INICIO_ETIQUETA);
            emparejar(TipoH.RESERVADA_BR);
            emparejar(TipoH.FIN_ETIQUETA);
            imprimir_tab();
            salida_json += "\"BR\"\n";
            TEXTO();
        }
    }
}


function HEAD() {
    emparejar(TipoH.RESERVADA_HEAD);
    emparejar(TipoH.FIN_ETIQUETA);
    imprimir_tab();
    salida_json += "\"HEAD\":{\n";
    add_tab();
    ELEMENTOS();
    delete_tab();
    imprimir_tab();
    salida_json += "},\n";
    emparejar(TipoH.DIAGONAL);
    emparejar(TipoH.RESERVADA_HEAD);
    emparejar(TipoH.FIN_ETIQUETA);
    ELEMENTOS();
}

function LABEL() {
    emparejar(TipoH.RESERVADA_LABEL);
    emparejar(TipoH.FIN_ETIQUETA);
    imprimir_tab();
    salida_json += "\"LABEL\":{\n";
    add_tab();
    TEXTO();
    delete_tab();
    imprimir_tab();
    salida_json += "},\n";
    emparejar(TipoH.INICIO_ETIQUETA);
    emparejar(TipoH.DIAGONAL);
    emparejar(TipoH.RESERVADA_LABEL);
    emparejar(TipoH.FIN_ETIQUETA);
    ELEMENTOS();
}

function DIV() {
    emparejar(TipoH.RESERVADA_DIV);
    imprimir_tab();
    salida_json += "\"DIV\":{\n";
    add_tab();
    STYLE();
    emparejar(TipoH.FIN_ETIQUETA);
    ELEMENTOS();
    delete_tab();
    imprimir_tab();
    salida_json += "},\n";
    emparejar(TipoH.INICIO_ETIQUETA);
    emparejar(TipoH.DIAGONAL);
    emparejar(TipoH.RESERVADA_DIV);
    emparejar(TipoH.FIN_ETIQUETA);
    ELEMENTOS();
}

function STYLE() {
    if (actual_t["tipo"] == TipoH.RESERVADA_STYLE) {
        imprimir_tab();
        salida_json += "\"STYLE\": ";
        emparejar(TipoH.RESERVADA_STYLE);
        emparejar(TipoH.SIGNO_IGUAL);
        emparejar(TipoH.COMILLA_DOBLE);
        emparejar(TipoH.RESERVADA_BACKGROUND);
        emparejar(TipoH.DOS_PUNTOS);
        salida_json += "background: \"" + actual_t["valor"] + "\",\n";
        emparejar(TipoH.COLOR);
        emparejar(TipoH.COMILLA_DOBLE);

    } else {
        //epsilon
    }
}

function BODY() {
    console.log("entra a body");
    console.log(actual_t);
    emparejar(TipoH.RESERVADA_BODY);
    imprimir_tab();
    salida_json += "\"BODY\":{\n";
    add_tab();
    STYLE();
    emparejar(TipoH.FIN_ETIQUETA);
    ELEMENTOS();
    delete_tab();
    imprimir_tab();
    salida_json += "}\n";
    emparejar(TipoH.INICIO_ETIQUETA);
    emparejar(TipoH.DIAGONAL);
    emparejar(TipoH.RESERVADA_BODY);
    emparejar(TipoH.FIN_ETIQUETA);
}

function H() {
    let h = "";
    if (actual_t["valor"] == "h1") {
        h = "H1";
    }
    else if (actual_t["valor"] == "h2") {
        h = "H2";
    }
    else if (actual_t["valor"] == "h3") {
        h = "H3";
    }
    else if (actual_t["valor"] == "h4") {
        h = "H4";
    }
    emparejar(TipoH.RESERVADA_H);
    emparejar(TipoH.FIN_ETIQUETA);
    imprimir_tab();
    salida_json += "\"" + h + "\":{\n";
    add_tab();
    TEXTO();
    delete_tab();
    imprimir_tab();
    salida_json += "},\n";
    emparejar(TipoH.INICIO_ETIQUETA);
    emparejar(TipoH.DIAGONAL);
    emparejar(TipoH.RESERVADA_H);
    emparejar(TipoH.FIN_ETIQUETA);
    ELEMENTOS();
}

function P() {
    emparejar(TipoH.RESERVADA_P);
    emparejar(TipoH.FIN_ETIQUETA);
    imprimir_tab();
    salida_json += "\"P\":{\n";
    add_tab();
    TEXTO();
    delete_tab();
    imprimir_tab();
    salida_json += "},\n";
    emparejar(TipoH.INICIO_ETIQUETA);
    emparejar(TipoH.DIAGONAL);
    emparejar(TipoH.RESERVADA_P);
    emparejar(TipoH.FIN_ETIQUETA);
    ELEMENTOS();
}

function BR() {
    emparejar(TipoH.RESERVADA_BR);
    emparejar(TipoH.FIN_ETIQUETA);
    imprimir_tab();
    salida_json += "\"BR\"\n";
    ELEMENTOS();
}

function INPUT() {
    emparejar(TipoH.RESERVADA_INPUT);
    emparejar(TipoH.FIN_ETIQUETA);
    imprimir_tab();
    salida_json += "\"BR\"\n";
    ELEMENTOS();
}

function BUTTON() {
    emparejar(TipoH.RESERVADA_BUTTON);
    emparejar(TipoH.FIN_ETIQUETA);
    imprimir_tab();
    salida_json += "\"BUTTON\":{\n";
    add_tab();
    TEXTO();
    delete_tab();
    imprimir_tab();
    salida_json += "},\n";
    emparejar(TipoH.INICIO_ETIQUETA);
    emparejar(TipoH.DIAGONAL);
    emparejar(TipoH.RESERVADA_BUTTON);
    emparejar(TipoH.FIN_ETIQUETA);
    ELEMENTOS();
}

function emparejar(tipo) {
    if (actual_t["tipo"] != tipo) {
        console.log("entra error");
    } else {
        if (actual_t["tipo"] != TipoH.ULTIMO) {
            console.log("pushea");
            console.log(actual_t["tipo"]);
            resultadosin_html.push(actual_t);
            posi++;
            actual_t = flujo_html[posi];
        }
    }
}