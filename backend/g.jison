
/* Definición Léxica */
%lex

%options case-sensitive

%{
	const RECOPILACION_ERRORES	= require('./ast').RECOPILACION_ERRORES;
%}

%%

\s+											// se ignoran espacios en blanco
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas


"import"			return 'RIMPORT';
"class"             return 'RCLASS';
"String"			return 'RSTRING';
"int"		    	return 'RINT';
"double"			return 'RDOUBLE';
"boolean"			return 'RBOOLEAN';
"char"			    return 'RCHAR';
"do"                return 'DO';
"while"			    return 'WHILE';
"if"				return 'IF';
"else"				return 'ELSE';
"for"				return 'FOR';
"switch"			return 'SWITCH';
"case"				return 'CASE';
"default"			return 'DEFAULT';
"break"				return 'BREAK';
"continue"          return 'CONTINUE';
"return"            return 'RETURN';
"void"              return 'VOID';
"true"              return 'BOOLT';
"false"             return 'BOOLF';
"System.out.print"  return 'SOUT';
"System.out.println" return 'SOUTLN';
":"					return 'DOS_PUNTOS';
";"					return 'PUN_COM';
"{"					return 'LLAVE_ABIR';
"}"					return 'LLAVE_CERRAR';
"("					return 'PARENT_ABRIR';
")"					return 'PARENT_CERRAR';
","					return 'COMA';

"&&"				return 'AND'
"||"				return 'OR';

"+"					return 'MAS';
"-"					return 'MENOS';
"*"					return 'POR';
"/"					return 'DIVIDIDO';
"&"					return 'CONCAT';
"^"                 return 'POTE';
"%"                 return 'MODU';

"<="				return 'MEN_QUE';
">="				return 'MA_QUE';
"=="				return 'IG_IG';
"!="				return 'DIF';

"<"					return 'MENQUE';
">"					return 'MAYQUE';
"="					return 'IGUAL';

"!"					return 'NOT';

\"[^\"]*\"				{ yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
[0-9]+("."[0-9]+)?\b  	return 'DECIMAL';
[0-9]+\b				return 'ENTERO';
\'[a-zA-Z]\'            return 'CHAR';
(_?[a-zA-Z])[a-zA-Z0-9_]*	return 'IDENTIFICADOR';


<<EOF>>				return 'EOF';
.					{ $$ = RECOPILACION_ERRORES.astErrores(RECOPILACION_ERRORES.astError(yytext , yylloc.first_line , yylloc.first_column, "Lexico")); RECOPILACION_ERRORES.astPrint($$);}

/lex

%{
	const TIPO_OPERACION	= require('./ast').TIPO_OPERACION;
	const TIPO_VALOR 		= require('./ast').TIPO_VALOR;
	const API	= require('./ast').API;
	const RECOPILACION_ERRORES	= require('./ast').RECOPILACION_ERRORES;
%}

%left 'OR'
%left 'AND'
%left 'DIF' 'IG_IG'
%left 'MEN_QUE' 'MA_QUE' 'MENQUE' 'MAYQUE'
%left 'CONCAT'
%left 'MAS' 'MENOS'
%left 'POR' 'DIVIDIDO'
%left 'POTE' 'MODU'
%left UMENOS
%right 'NOT'
%start ini

%% /* Definición de la gramática */

ini
	: s EOF {
		return $1;
	}
;

s
    : imports clases { $$ = API.astArchivo ($1, $2); }
    | clases { $$ = API.astArchivo ("sin imports", $2); }
;

imports 
    : imports import { $1.push($2) ; $$ = $1; }
    | import { $$ = API.astImports($1) ;} 
;

import
    : RIMPORT IDENTIFICADOR PUN_COM { $$ = API.astImport($2) ; }
    | error { $$ = RECOPILACION_ERRORES.astErroresS(RECOPILACION_ERRORES.astErrorS($1 , @1.first_line, @1.first_column, "Sintactico")); RECOPILACION_ERRORES.astPrintS($$);}

;

clases
    : clases clase { $1.push($2) ; $$ = $1; }
    | clase { $$ = API.astClases($1); }
;

clase 
    : RCLASS IDENTIFICADOR LLAVE_ABIR contenido_metodo_clase LLAVE_CERRAR { $$ = API.astClase($2 , $4) ; }
    | RCLASS IDENTIFICADOR LLAVE_ABIR  LLAVE_CERRAR { $$ = API.astClase($2 , "null") ; }    
;


contenido_metodo_clase
    :contenido_metodo_clase instruccion_clase { $1.push($2);  $$ = $1; }
    |instruccion_clase                     { $$ = [$1]; }
;

instruccion_clase
    : RINT     identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.ENTERO , [$2]); }
    | RINT     identificador IGUAL  exp PUN_COM                             { $$ = API.astDeclaracion( TIPO_VALOR.ENTERO , $2 , $4 ); }
    | RINT     IDENTIFICADOR PARENT_ABRIR  PARENT_CERRAR LLAVE_ABIR contenido_funcion LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.ENTERO , $2 , "sin_parametro" , $6); }
    | RINT     IDENTIFICADOR PARENT_ABRIR parametros PARENT_CERRAR LLAVE_ABIR contenido_funcion LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.ENTERO , $2 , $4, $7); }
    | RINT     IDENTIFICADOR PARENT_ABRIR  PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.ENTERO , $2 , "sin_parametro" , "null"); }
    | RINT     IDENTIFICADOR PARENT_ABRIR parametros PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.ENTERO , $2 , $4, "null"); }
    | RSTRING  identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.CADENA , $2); }
    | RSTRING  identificador IGUAL  exp PUN_COM                             { $$ = API.astDeclaracion( TIPO_VALOR.CADENA , $2 , $4 ); }
    | RSTRING  IDENTIFICADOR PARENT_ABRIR  PARENT_CERRAR LLAVE_ABIR contenido_funcion LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.CADENA , $2 , "sin_parametro" , $6);}
    | RSTRING  IDENTIFICADOR PARENT_ABRIR parametros PARENT_CERRAR LLAVE_ABIR contenido_funcion LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.CADENA , $2 , $4, $7);}
    | RSTRING  IDENTIFICADOR PARENT_ABRIR  PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.CADENA , $2 , "sin_parametro" , "null");}
    | RSTRING  IDENTIFICADOR PARENT_ABRIR parametros PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.CADENA , $2 , $4, "null");}
    | RBOOLEAN identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.BOOLEANO , $2); }
    | RBOOLEAN identificador IGUAL  exp PUN_COM                             { $$ = API.astDeclaracion( TIPO_VALOR.BOOLEANO , $2 , $4 ); }
    | RBOOLEAN IDENTIFICADOR PARENT_ABRIR  PARENT_CERRAR LLAVE_ABIR contenido_funcion LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.BOOLEANO , $2 , "sin_parametro" , $6); } 
    | RBOOLEAN IDENTIFICADOR PARENT_ABRIR parametros PARENT_CERRAR LLAVE_ABIR contenido_funcion LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.BOOLEANO , $2 , $4, $7); } 
    | RBOOLEAN IDENTIFICADOR PARENT_ABRIR  PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.BOOLEANO , $2 , "sin_parametro" , "null"); } 
    | RBOOLEAN IDENTIFICADOR PARENT_ABRIR parametros PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.BOOLEANO , $2 , $4, "null"); } 
    | RDOUBLE  identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.DOUBLE , $2); }
    | RDOUBLE  identificador IGUAL  exp PUN_COM                             { $$ = API.astDeclaracion( TIPO_VALOR.DOUBLE , $2 , $4 ); }
    | RDOUBLE  IDENTIFICADOR PARENT_ABRIR  PARENT_CERRAR LLAVE_ABIR contenido_funcion LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.DOUBLE , $2 , "sin_parametro" , $6); }
    | RDOUBLE  IDENTIFICADOR PARENT_ABRIR parametros PARENT_CERRAR LLAVE_ABIR contenido_funcion LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.DOUBLE , $2 , $4, $7); }
    | RDOUBLE  IDENTIFICADOR PARENT_ABRIR  PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.DOUBLE , $2 , "sin_parametro" , "null"); }
    | RDOUBLE  IDENTIFICADOR PARENT_ABRIR parametros PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.DOUBLE , $2 , $4, "null"); }
    | RCHAR    identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.CARACTER , $2); }
    | RCHAR    identificador IGUAL  CHAR PUN_COM                                           { $$ = API.astDeclaracion( TIPO_VALOR.CARACTER , $2 , $4 ); }
    | RCHAR    IDENTIFICADOR PARENT_ABRIR  PARENT_CERRAR LLAVE_ABIR contenido_funcion LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.CARACTER , $2 , "sin_parametro" , $6); }
    | RCHAR    IDENTIFICADOR PARENT_ABRIR parametros PARENT_CERRAR LLAVE_ABIR contenido_funcion LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.CARACTER , $2 , $4, $7); }
    | RCHAR    IDENTIFICADOR PARENT_ABRIR  PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.CARACTER , $2 , "sin_parametro" , "null"); }
    | RCHAR    IDENTIFICADOR PARENT_ABRIR parametros PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR { $$ = API.astFuncion(TIPO_VALOR.CARACTER , $2 , $4, "null"); }
    | IDENTIFICADOR IGUAL valor_decla PUN_COM		                                      { $$ = API.astAsignacion($1, $3); } 
    | VOID IDENTIFICADOR PARENT_ABRIR  PARENT_CERRAR LLAVE_ABIR contenido_metodo LLAVE_CERRAR     { $$ = API.astMetodo("no retorna" , $2 , "sin parametros" , $6); }        
    | VOID IDENTIFICADOR PARENT_ABRIR parametros PARENT_CERRAR LLAVE_ABIR contenido_metodo LLAVE_CERRAR     { $$ = API.astMetodo("no retorna" , $2 , $4 , $7); }
    | VOID IDENTIFICADOR PARENT_ABRIR  PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR     { $$ = API.astMetodo("no retorna" , $2 , "sin parametros" , "null"); }        
    | VOID IDENTIFICADOR PARENT_ABRIR parametros PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR     { $$ = API.astMetodo("no retorna" , $2 , $4 , "null"); }
    | llamada_metodo   PUN_COM                                 { $$ = $1; }
    | error { $$ = RECOPILACION_ERRORES.astErroresS(RECOPILACION_ERRORES.astErrorS($1 , @1.first_line, @1.first_column, "Sintactico")); RECOPILACION_ERRORES.astPrintS($$);}
;

parametros
    :parametros COMA parametro      { $1.push($3); $$ = $1; }
    |parametro                  { $$ = API.astListaP($1); }
;

parametro
    :RINT IDENTIFICADOR         { $$ = API.astParametro( TIPO_VALOR.ENTERO , $2); }
    |RSTRING IDENTIFICADOR      { $$ = API.astParametro( TIPO_VALOR.CADENA , $2); }
    |RBOOLEAN IDENTIFICADOR     { $$ = API.astParametro( TIPO_VALOR.BOOLEANO , $2); }
    |RDOUBLE IDENTIFICADOR      { $$ = API.astParametro( TIPO_VALOR.DOUBLE , $2); }
    |RCHAR IDENTIFICADOR        { $$ = API.astParametro( TIPO_VALOR.CARACTER  , $2); }
;

identificador
    : identificador COMA id           { $1.push($3); $$ = $1; }
    | id                              { $$ = API.astListaI($1); }
;

id 
    : IDENTIFICADOR { $$ = API.astIden($1) ;}

;

contenido_metodo
	: contenido_metodo contenido 	{ $1.push($2); $$ = $1; }
	| contenido					{ $$ = [$1]; }

;

contenido
    : RINT     identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.ENTERO , [$2]); }
    | RINT     identificador IGUAL  exp PUN_COM                             { $$ = API.astDeclaracion( TIPO_VALOR.ENTERO , $2 , $4 ); }
    | RSTRING  identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.CADENA , $2); }
    | RSTRING  identificador IGUAL  exp PUN_COM                               { $$ = API.astDeclaracion( TIPO_VALOR.CADENA , $2 , $4 ); }
    | RBOOLEAN identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.BOOLEANO , $2); }
    | RBOOLEAN identificador IGUAL  exp PUN_COM                               { $$ = API.astDeclaracion( TIPO_VALOR.BOOLEANO , $2 , $4 ); }
    | RDOUBLE  identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.DOUBLE , $2); }
    | RDOUBLE  identificador IGUAL  exp PUN_COM                             { $$ = API.astDeclaracion( TIPO_VALOR.DOUBLE , $2 , $4 ); }
    | RCHAR    identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.CARACTER , $2); }
    | RCHAR    identificador IGUAL  CHAR PUN_COM                                           { $$ = API.astDeclaracion( TIPO_VALOR.CARACTER , $2 , $4 ); }

	| WHILE PARENT_ABRIR exp PARENT_CERRAR LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR { $$ = API.astWhile($3, $6); }	
	| WHILE PARENT_ABRIR exp PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR { $$ = API.astWhile($3, "null"); }	
    | FOR PARENT_ABRIR IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MAS MAS PARENT_CERRAR LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR
														{ $$ = API.astFor($3,$5,$7,$9,$14); }
	| FOR PARENT_ABRIR RINT IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MAS MAS PARENT_CERRAR LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR
														{ $$ = API.astFor($4,$6,$8,$10,$15); }
    | FOR PARENT_ABRIR IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MENOS MENOS PARENT_CERRAR LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR
														{ $$ = API.astForD($3,$5,$7,$9,$14); }
	| FOR PARENT_ABRIR RINT IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MENOS MENOS PARENT_CERRAR LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR
														{ $$ = API.astForD($4,$6,$8,$10,$15); }


    | FOR PARENT_ABRIR IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MAS MAS PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR
														{ $$ = API.astFor($3,$5,$7,$9,"null"); }
	| FOR PARENT_ABRIR RINT IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MAS MAS PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR
														{ $$ = API.astFor($4,$6,$8,$10,"null"); }
    | FOR PARENT_ABRIR IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MENOS MENOS PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR
														{ $$ = API.astForD($3,$5,$7,$9,"null"); }
	| FOR PARENT_ABRIR RINT IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MENOS MENOS PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR
														{ $$ = API.astForD($4,$6,$8,$10,"null"); }


    | IDENTIFICADOR IGUAL exp PUN_COM		                                  { $$ = API.astAsignacion($1, $3); } 
	| if  { $$ = API.astRif($1); }
	| if else_if {  $$ = API.astElseifC($1 , $2); }
    | if else {  $$ = API.astElseC($1 , $2); }
	| if else_if else { $$ = API.astIfCompleto($1, $2 , $3); }                                                        
	| SWITCH PARENT_ABRIR exp PARENT_CERRAR LLAVE_ABIR sw_case LLAVE_CERRAR
		{ $$ = API.astSwitch($3,$6);}
    | DO LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR WHILE PARENT_ABRIR exp PARENT_CERRAR PUN_COM { $$ = API.astDoWhile( $7, $3); } 
    | DO LLAVE_ABIR  LLAVE_CERRAR WHILE PARENT_ABRIR exp PARENT_CERRAR PUN_COM { $$ = API.astDoWhile( "null", $3); } 

    | SOUT PARENT_ABRIR exp PARENT_CERRAR PUN_COM            { $$ = API.astSout($3); }
    | SOUTLN PARENT_ABRIR exp PARENT_CERRAR PUN_COM          { $$ = API.astSout($3); }
    | llamada_metodo   PUN_COM                                 { $$ = $1; }
    | error { $$ = RECOPILACION_ERRORES.astErroresS(RECOPILACION_ERRORES.astErrorS($1 , @1.first_line, @1.first_column, "Sintactico")); RECOPILACION_ERRORES.astPrintS($$);}
;


contenido_metodo_break
	: contenido_metodo_break instruccionb 	{ $1.push($2); $$ = $1; }
	| instruccionb					    { $$ = [$1]; }
;

instruccionb
    : RINT     identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.ENTERO , [$2]); }
    | RINT     identificador IGUAL  exp PUN_COM                             { $$ = API.astDeclaracion( TIPO_VALOR.ENTERO , $2 , $4 ); }
    | RSTRING  identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.CADENA , $2); }
    | RSTRING  identificador IGUAL  exp PUN_COM                               { $$ = API.astDeclaracion( TIPO_VALOR.CADENA , $2 , $4 ); }
    | RBOOLEAN identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.BOOLEANO , $2); }
    | RBOOLEAN identificador IGUAL  exp PUN_COM                               { $$ = API.astDeclaracion( TIPO_VALOR.BOOLEANO , $2 , $4 ); }
    | RDOUBLE  identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.DOUBLE , $2); }
    | RDOUBLE  identificador IGUAL  exp PUN_COM                             { $$ = API.astDeclaracion( TIPO_VALOR.DOUBLE , $2 , $4 ); }
    | RCHAR    identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.CARACTER , $2); }
    | RCHAR    identificador IGUAL  CHAR PUN_COM                                           { $$ = API.astDeclaracion( TIPO_VALOR.CARACTER , $2 , $4 ); }

	| WHILE PARENT_ABRIR exp PARENT_CERRAR LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR { $$ = API.astWhile($3, $6); }	
	| WHILE PARENT_ABRIR exp PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR { $$ = API.astWhile($3, "null"); }	
    | FOR PARENT_ABRIR IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MAS MAS PARENT_CERRAR LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR
														{ $$ = API.astFor($3,$5,$7,$9,$14); }
	| FOR PARENT_ABRIR RINT IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MAS MAS PARENT_CERRAR LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR
														{ $$ = API.astFor($4,$6,$8,$10,$15); }
    | FOR PARENT_ABRIR IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MENOS MENOS PARENT_CERRAR LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR
														{ $$ = API.astForD($3,$5,$7,$9,$14); }
	| FOR PARENT_ABRIR RINT IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MENOS MENOS PARENT_CERRAR LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR
														{ $$ = API.astForD($4,$6,$8,$10,$15); }


    | FOR PARENT_ABRIR IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MAS MAS PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR
														{ $$ = API.astFor($3,$5,$7,$9,"null"); }
	| FOR PARENT_ABRIR RINT IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MAS MAS PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR
														{ $$ = API.astFor($4,$6,$8,$10,"null"); }
    | FOR PARENT_ABRIR IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MENOS MENOS PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR
														{ $$ = API.astForD($3,$5,$7,$9,"null"); }
	| FOR PARENT_ABRIR RINT IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MENOS MENOS PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR
														{ $$ = API.astForD($4,$6,$8,$10,"null"); }


    | IDENTIFICADOR IGUAL exp PUN_COM		                                  { $$ = API.astAsignacion($1, $3); } 
	| if  { $$ = API.astRif($1); }
	| if else_if {  $$ = API.astElseifC($1 , $2); }
    | if else {  $$ = API.astElseC($1 , $2); }
	| if else_if else { $$ = API.astIfCompleto($1, $2 , $3); }                                                        
	| SWITCH PARENT_ABRIR exp PARENT_CERRAR LLAVE_ABIR sw_case LLAVE_CERRAR
		{ $$ = API.astSwitch($3,$6);}
    | DO LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR WHILE PARENT_ABRIR exp PARENT_CERRAR PUN_COM { $$ = API.astDoWhile( $7, $3); } 
    | DO LLAVE_ABIR  LLAVE_CERRAR WHILE PARENT_ABRIR exp PARENT_CERRAR PUN_COM { $$ = API.astDoWhile( "null", $3); } 

    | SOUT PARENT_ABRIR exp PARENT_CERRAR PUN_COM            { $$ = API.astSout($3); }
    | SOUTLN PARENT_ABRIR exp PARENT_CERRAR PUN_COM          { $$ = API.astSout($3); }
    | llamada_metodo   PUN_COM                                 { $$ = $1; }

    | BREAK PUN_COM   { $$ = API.astBreak( $1); }
    | CONTINUE PUN_COM { $$ = astContinue($1); }
    | error { $$ = RECOPILACION_ERRORES.astErroresS(RECOPILACION_ERRORES.astErrorS($1 , @1.first_line, @1.first_column, "Sintactico")); RECOPILACION_ERRORES.astPrintS($$);}
;


contenido_funcion
	: contenido_funcion instruccionint 	{ $1.push($2); $$ = $1; }
	| instruccionint					    { $$ = [$1]; }
;

instruccionint
    : RINT     identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.ENTERO , [$2]); }
    | RINT     identificador IGUAL  exp PUN_COM                             { $$ = API.astDeclaracion( TIPO_VALOR.ENTERO , $2 , $4 ); }
    | RSTRING  identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.CADENA , $2); }
    | RSTRING  identificador IGUAL  exp PUN_COM                               { $$ = API.astDeclaracion( TIPO_VALOR.CADENA , $2 , $4 ); }
    | RBOOLEAN identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.BOOLEANO , $2); }
    | RBOOLEAN identificador IGUAL  exp PUN_COM                               { $$ = API.astDeclaracion( TIPO_VALOR.BOOLEANO , $2 , $4 ); }
    | RDOUBLE  identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.DOUBLE , $2); }
    | RDOUBLE  identificador IGUAL  exp PUN_COM                             { $$ = API.astDeclaracion( TIPO_VALOR.DOUBLE , $2 , $4 ); }
    | RCHAR    identificador PUN_COM                                                       { $$ = API.astDeclaN( TIPO_VALOR.CARACTER , $2); }
    | RCHAR    identificador IGUAL  CHAR PUN_COM                                           { $$ = API.astDeclaracion( TIPO_VALOR.CARACTER , $2 , $4 ); }

	| WHILE PARENT_ABRIR exp PARENT_CERRAR LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR { $$ = API.astWhile($3, $6); }	
	| WHILE PARENT_ABRIR exp PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR { $$ = API.astWhile($3, "null"); }	
    | FOR PARENT_ABRIR IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MAS MAS PARENT_CERRAR LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR
														{ $$ = API.astFor($3,$5,$7,$9,$14); }
	| FOR PARENT_ABRIR RINT IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MAS MAS PARENT_CERRAR LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR
														{ $$ = API.astFor($4,$6,$8,$10,$15); }
    | FOR PARENT_ABRIR IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MENOS MENOS PARENT_CERRAR LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR
														{ $$ = API.astForD($3,$5,$7,$9,$14); }
	| FOR PARENT_ABRIR RINT IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MENOS MENOS PARENT_CERRAR LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR
														{ $$ = API.astForD($4,$6,$8,$10,$15); }


    | FOR PARENT_ABRIR IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MAS MAS PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR
														{ $$ = API.astFor($3,$5,$7,$9,"null"); }
	| FOR PARENT_ABRIR RINT IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MAS MAS PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR
														{ $$ = API.astFor($4,$6,$8,$10,"null"); }
    | FOR PARENT_ABRIR IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MENOS MENOS PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR
														{ $$ = API.astForD($3,$5,$7,$9,"null"); }
	| FOR PARENT_ABRIR RINT IDENTIFICADOR IGUAL exp PUN_COM exp PUN_COM IDENTIFICADOR MENOS MENOS PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR
														{ $$ = API.astForD($4,$6,$8,$10,"null"); }


    | IDENTIFICADOR IGUAL exp PUN_COM		                                  { $$ = API.astAsignacion($1, $3); } 
	| if  { $$ = API.astRif($1); }
	| if else_if {  $$ = API.astElseifC($1 , $2); }
    | if else {  $$ = API.astElseC($1 , $2); }
	| if else_if else { $$ = API.astIfCompleto($1, $2 , $3); }                                                        
	| SWITCH PARENT_ABRIR exp PARENT_CERRAR LLAVE_ABIR sw_case LLAVE_CERRAR
		{ $$ = API.astSwitch($3,$6);}
    | DO LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR WHILE PARENT_ABRIR exp PARENT_CERRAR PUN_COM { $$ = API.astDoWhile( $7, $3); } 
    | DO LLAVE_ABIR  LLAVE_CERRAR WHILE PARENT_ABRIR exp PARENT_CERRAR PUN_COM { $$ = API.astDoWhile( "null", $3); } 

    | SOUT PARENT_ABRIR exp PARENT_CERRAR PUN_COM            { $$ = API.astSout($3); }
    | SOUTLN PARENT_ABRIR exp PARENT_CERRAR PUN_COM          { $$ = API.astSout($3); }
    | llamada_metodo   PUN_COM                                 { $$ = $1; }

    | RETURN exp PUN_COM { $$ = API.astReturn(TIPO_VALOR.ENTERO , $2); }
    | error { $$ = RECOPILACION_ERRORES.astErroresS(RECOPILACION_ERRORES.astErrorS($1 , @1.first_line, @1.first_column, "Sintactico")); RECOPILACION_ERRORES.astPrintS($$);}
;



if 
    : IF PARENT_ABRIR exp PARENT_CERRAR LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR { $$ = API.astIf($3, $6); }
    | IF PARENT_ABRIR exp PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR { $$ = API.astIf($3, "-"); }    

;

else    
    : ELSE LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR { $$ = API.astElse($3); } 
    | ELSE LLAVE_ABIR  LLAVE_CERRAR { $$ = API.astElse("-"); } 

;

else_if
    :else_if elif { $1.push($2); $$ = $1; }
    | elif { $$ = API.astelif($1); }

;
elif
    : ELSE IF PARENT_ABRIR exp PARENT_CERRAR LLAVE_ABIR contenido_metodo_break LLAVE_CERRAR { $$ = API.astElseif( $4, $7); }
    | ELSE IF PARENT_ABRIR exp PARENT_CERRAR LLAVE_ABIR  LLAVE_CERRAR { $$ = API.astElseif( $4, "-"); }    

;


sw_case : sw_case case
    {
      $1.push($2);
	  $$ = $1;
    }
  | case
  	{ $$ = API.astCases($1);}
;

case 
  : CASE exp DOS_PUNTOS contenido_metodo_break
    { $$ = API.astCase($2,$4); }
  | DEFAULT DOS_PUNTOS contenido_metodo_break
    { $$ = API.astCaseDef($3); }
  | CASE exp DOS_PUNTOS 
    { $$ = API.astCase($2,$4); }
  | DEFAULT DOS_PUNTOS 
    { $$ = API.astCaseDef($3); }

;

exp
	: MENOS exp %prec UMENOS				{ $$ = API.expresionU($2, TIPO_OPERACION.NEGATIVO); }
    | NOT exp							{ $$ = API.expresionU($2, TIPO_OPERACION.NOT); }
	| exp MAS exp			{ $$ = API.expresion($1, $3, TIPO_OPERACION.SUMA); }
	| exp MENOS exp		{ $$ = API.expresion($1, $3, TIPO_OPERACION.RESTA); }
	| exp POR exp			{ $$ = API.expresion($1, $3, TIPO_OPERACION.MULTIPLICACION); }        
	| exp DIVIDIDO exp	{ $$ = API.expresion($1, $3, TIPO_OPERACION.DIVISION); }
	| exp POTE exp	{ $$ = API.expresion($1, $3, TIPO_OPERACION.POTENCIA); }
	| exp MODU exp	{ $$ = API.expresion($1, $3, TIPO_OPERACION.MODULO); }     
	| exp AND exp     { $$ = API.expresion($1, $3, TIPO_OPERACION.AND); }
	| exp OR exp     { $$ = API.expresion($1, $3, TIPO_OPERACION.OR); }    	 
	| exp IG_IG exp			{ $$ = API.expresion($1, $3, TIPO_OPERACION.DOBLE_IGUAL); }
	| exp DIF exp			{ $$ = API.expresion($1, $3, TIPO_OPERACION.NO_IGUAL); }              
	| exp MA_QUE exp	{ $$ = API.expresion($1, $3, TIPO_OPERACION.MAYOR_IGUAL); }
	| exp MEN_QUE exp	{ $$ = API.expresion($1, $3, TIPO_OPERACION.MENOR_IGUAL); }
	| exp MAYQUE exp		{ $$ = API.expresion($1, $3, TIPO_OPERACION.MAYOR_QUE); }
	| exp MENQUE exp		{ $$ = API.expresion($1, $3, TIPO_OPERACION.MENOR_QUE); }
	| PARENT_ABRIR exp PARENT_CERRAR					{ $$ = $2; }
	| ENTERO											{ $$ = API.nuevoValor(Number($1), TIPO_VALOR.ENTERO); }
	| DECIMAL											{ $$ = API.nuevoValor(Number($1), TIPO_VALOR.DOUBLE); }
	| IDENTIFICADOR										{ $$ = API.nuevoValor($1, TIPO_VALOR.IDENTIFICADOR); }
    | llamada_metodo                                   { $$ = $1; }
	| CADENA											{ $$ = API.nuevoValor($1, TIPO_VALOR.CADENA); }
	| CHAR											    { $$ = API.nuevoValor($1, TIPO_VALOR.CARACTER); }
    | BOOLT									        	{ $$ = API.nuevoValor($1, TIPO_VALOR.BOOLEANO); }
    | BOOLF									        	{ $$ = API.nuevoValor($1, TIPO_VALOR.BOOLEANO); }        
    | error { $$ = RECOPILACION_ERRORES.astErroresS(RECOPILACION_ERRORES.astErrorS($1 , @1.first_line, @1.first_column, "Sintactico")); RECOPILACION_ERRORES.astPrintS($$);}
;



llamada_metodo
    : IDENTIFICADOR PARENT_ABRIR valores PARENT_CERRAR        { $$ = API.astLlamadaM($1 , $3); }

;

valores
    : valores COMA valor { $1.push($3); $$ = $1; }
    | valor { $$ = API.astValores($1); }
;

valor
    : exp         { $$ = API.astValor($1); }
    |             {  }

;

