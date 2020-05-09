
/* Definición Léxica */
%lex

%options case-insensitive

%%

\s+											// se ignoran espacios en blanco
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas


"import"			return 'RIMPORT';
"class"             return 'RCLASS';
"string"			return 'RSTRING';
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
":"					return 'DOSPTS';
";"					return 'PTCOMA';
"{"					return 'LLAVIZQ';
"}"					return 'LLAVDER';
"("					return 'PARIZQ';
")"					return 'PARDER';
","					return 'COMA';

"+="				return 'O_MAS';
"-="				return 'O_MENOS';
"*="				return 'O_POR';
"/="				return 'O_DIVIDIDO';
"&&"				return 'AND'
"||"				return 'OR';

"+"					return 'MAS';
"-"					return 'MENOS';
"*"					return 'POR';
"/"					return 'DIVIDIDO';
"&"					return 'CONCAT';

"<="				return 'MENIGQUE';
">="				return 'MAYIGQUE';
"=="				return 'DOBLEIG';
"!="				return 'NOIG';

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
.					{ console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }

/lex


%{
	const TIPO_OPERACION	= require('./ast').TIPO_OPERACION;
	const TIPO_VALOR 		= require('./ast').TIPO_VALOR;
	const API	= require('./ast').API;
%}


/* Asociación de operadores y precedencia */
%left 'CONCAT'
%left 'MAS' 'MENOS'
%left 'POR' 'DIVIDIDO'
%left UMENOS

%start ini

%% /* Definición de la gramática */

ini
	: s EOF {
		// cuado se haya reconocido la entrada completa retornamos el AST
		return $1;
	}
;

s
    : imports clases { $$ = $2; }
;

imports 
    : imports import { $1.push($2) ; $$ = $1; }
    | import { $$ = $1 ;} 
;

import
    : RIMPORT IDENTIFICADOR PTCOMA { $$ = API.astImport($2) ; }
;

clases
    : clases clase { $1.push($2) ; $$ = $1; }
    | clase { $$ = $1; }
;

clase 
    : RCLASS IDENTIFICADOR LLAVIZQ instrucciones_clase LLAVDER { $$ = API.astClase($2 , $4) ; }
;


instrucciones_clase
    :instrucciones_clase instruccion_clase { $1.push($2);  $$ = $1; }
    |instruccion_clase                     { $$ = [$1]; }
;

instruccion_clase
    : RINT     identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.ENTERO , [$2]); }
    | RINT     identificador IGUAL  expresion_numerica PTCOMA                             { $$ = API.astDeclaracion( TIPO_VALOR.ENTERO , $2 , $4 ); }
    | RINT     IDENTIFICADOR PARIZQ  PARDER LLAVIZQ instrucciones_int LLAVDER { $$ = API.astFuncion(TIPO_VALOR.ENTERO , $2 , "sin_parametro" , $6); }
    | RINT     IDENTIFICADOR PARIZQ parametros PARDER LLAVIZQ instrucciones_int LLAVDER { $$ = API.astFuncion(TIPO_VALOR.ENTERO , $2 , $4, $7); }
    | RSTRING  identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.CADENA , $2); }
    | RSTRING  identificador IGUAL  expresion_cadena PTCOMA                             { $$ = API.astDeclaracion( TIPO_VALOR.CADENA , $2 , $4 ); }
    | RSTRING  IDENTIFICADOR PARIZQ  PARDER LLAVIZQ instrucciones_cadena LLAVDER { $$ = API.astFuncion(TIPO_VALOR.CADENA , $2 , "sin_parametro" , $6);}
    | RSTRING  IDENTIFICADOR PARIZQ parametros PARDER LLAVIZQ instrucciones_cadena LLAVDER { $$ = API.astFuncion(TIPO_VALOR.CADENA , $2 , $4, $7);}
    | RBOOLEAN identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.BOOLEANO , $2); }
    | RBOOLEAN identificador IGUAL  expresion_logica PTCOMA                             { $$ = API.astDeclaracion( TIPO_VALOR.BOOLEANO , $2 , $4 ); }
    | RBOOLEAN IDENTIFICADOR PARIZQ  PARDER LLAVIZQ instrucciones_boolean LLAVDER { $$ = API.astFuncion(TIPO_VALOR.BOOLEANO , $2 , "sin_parametro" , $6); } 
    | RBOOLEAN IDENTIFICADOR PARIZQ parametros PARDER LLAVIZQ instrucciones_boolean LLAVDER { $$ = API.astFuncion(TIPO_VALOR.BOOLEANO , $2 , $4, $7); } 
    | RDOUBLE  identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.DOUBLE , $2); }
    | RDOUBLE  identificador IGUAL  expresion_numerica PTCOMA                             { $$ = API.astDeclaracion( TIPO_VALOR.DOUBLE , $2 , $4 ); }
    | RDOUBLE  IDENTIFICADOR PARIZQ  PARDER LLAVIZQ instrucciones_int LLAVDER { $$ = API.astFuncion(TIPO_VALOR.DOUBLE , $2 , "sin_parametro" , $6); }
    | RDOUBLE  IDENTIFICADOR PARIZQ parametros PARDER LLAVIZQ instrucciones_int LLAVDER { $$ = API.astFuncion(TIPO_VALOR.DOUBLE , $2 , $4, $7); }
    | RCHAR    identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.CARACTER , $2); }
    | RCHAR    identificador IGUAL  CHAR PTCOMA                                           { $$ = API.astDeclaracion( TIPO_VALOR.CARACTER , $2 , $4 ); }
    | RCHAR    IDENTIFICADOR PARIZQ  PARDER LLAVIZQ instrucciones_cadena LLAVDER { $$ = API.astFuncion(TIPO_VALOR.CARACTER , $2 , "sin_parametro" , $6); }
    | RCHAR    IDENTIFICADOR PARIZQ parametros PARDER LLAVIZQ instrucciones_cadena LLAVDER { $$ = API.astFuncion(TIPO_VALOR.CARACTER , $2 , $4, $7); }
    | IDENTIFICADOR IGUAL valor_decla PTCOMA		                                      { $$ = API.astAsignacion($1, $3); } 
    | VOID IDENTIFICADOR PARIZQ  PARDER LLAVIZQ instrucciones LLAVDER     { $$ = API.astMetodo("no retorna" , $2 , "sin parametros" , $6); }        
    | VOID IDENTIFICADOR PARIZQ parametros PARDER LLAVIZQ instrucciones LLAVDER     { $$ = API.astMetodo("no retorna" , $2 , $4 , $7); }
    | error { console.log("error"); }

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

instrucciones
	: instrucciones instruccion 	{ $1.push($2); $$ = $1; }
	| instruccion					{ $$ = [$1]; }
;

instruccion
    : RINT     identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.ENTERO , [$2]); }
    | RINT     identificador IGUAL  expresion_numerica PTCOMA                             { $$ = API.astDeclaracion( TIPO_VALOR.ENTERO , $2 , $4 ); }
    | RSTRING  identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.CADENA , $2); }
    | RSTRING  identificador IGUAL  expresion_cadena PTCOMA                               { $$ = API.astDeclaracion( TIPO_VALOR.CADENA , $2 , $4 ); }
    | RBOOLEAN identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.BOOLEANO , $2); }
    | RBOOLEAN identificador IGUAL  expresion_logica PTCOMA                               { $$ = API.astDeclaracion( TIPO_VALOR.BOOLEANO , $2 , $4 ); }
    | RDOUBLE  identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.DOUBLE , $2); }
    | RDOUBLE  identificador IGUAL  expresion_numerica PTCOMA                             { $$ = API.astDeclaracion( TIPO_VALOR.DOUBLE , $2 , $4 ); }
    | RCHAR    identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.CARACTER , $2); }
    | RCHAR    identificador IGUAL  CHAR PTCOMA                                           { $$ = API.astDeclaracion( TIPO_VALOR.CARACTER , $2 , $4 ); }
	| WHILE PARIZQ expresion_logica PARDER LLAVIZQ instrucciones_break LLAVDER { $$ = API.astWhile($3, $6); }	
    | FOR PARIZQ IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MAS MAS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astFor($3,$5,$7,$9,$14); }
	| FOR PARIZQ RINT IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MAS MAS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astFor($4,$6,$8,$10,$15); }
    | FOR PARIZQ IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MENOS MENOS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astForD($3,$5,$7,$9,$14); }
	| FOR PARIZQ RINT IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MENOS MENOS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astForD($4,$6,$8,$10,$15); }
	| error { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
    | IDENTIFICADOR IGUAL expresion_cadena PTCOMA		                                  { $$ = API.astAsignacion($1, $3); } 
	| if  { $$ = API.astRif($1); }
	| if else_if {  $$ = API.astElseifC($1 , $2); }
    | if else {  $$ = API.astElseC($1 , $2); }
	| if else_if else { $$ = API.astIfCompleto($1, $2 , $3); }                                                        
	| SWITCH PARIZQ expresion_numerica PARDER LLAVIZQ casos LLAVDER
		{ $$ = API.astSwitch($3,$6);}
    | DO LLAVIZQ instrucciones_break LLAVDER WHILE PARIZQ expresion_logica PARDER PTCOMA { $$ = API.astDoWhile( $7, $3); } 
    | SOUT PARIZQ expresion_cadena PARDER PTCOMA            { $$ = API.astSout($3); }
    | SOUTLN PARIZQ expresion_cadena PARDER PTCOMA          { $$ = API.astSout($3); }
    | llamada_metodo   PTCOMA                                 { $$ = $1; }

;


instrucciones_break
	: instrucciones_break instruccionb 	{ $1.push($2); $$ = $1; }
	| instruccionb					    { $$ = [$1]; }
;

instruccionb
    : RINT     identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.ENTERO , [$2]); }
    | RINT     identificador IGUAL  expresion_numerica PTCOMA                             { $$ = API.astDeclaracion( TIPO_VALOR.ENTERO , $2 , $4 ); }
    | RSTRING  identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.CADENA , $2); }
    | RSTRING  identificador IGUAL  expresion_cadena PTCOMA                               { $$ = API.astDeclaracion( TIPO_VALOR.CADENA , $2 , $4 ); }
    | RBOOLEAN identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.BOOLEANO , $2); }
    | RBOOLEAN identificador IGUAL  expresion_logica PTCOMA                               { $$ = API.astDeclaracion( TIPO_VALOR.BOOLEANO , $2 , $4 ); }
    | RDOUBLE  identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.DOUBLE , $2); }
    | RDOUBLE  identificador IGUAL  expresion_numerica PTCOMA                             { $$ = API.astDeclaracion( TIPO_VALOR.DOUBLE , $2 , $4 ); }
    | RCHAR    identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.CARACTER , $2); }
    | RCHAR    identificador IGUAL  CHAR PTCOMA                                           { $$ = API.astDeclaracion( TIPO_VALOR.CARACTER , $2 , $4 ); }
	| WHILE PARIZQ expresion_logica PARDER LLAVIZQ instrucciones_break LLAVDER { $$ = API.astWhile($3, $6); }	
    | FOR PARIZQ IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MAS MAS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astFor($3,$5,$7,$9,$14); }
	| FOR PARIZQ RINT IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MAS MAS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astFor($4,$6,$8,$10,$15); }
    | FOR PARIZQ IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MENOS MENOS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astForD($3,$5,$7,$9,$14); }
	| FOR PARIZQ RINT IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MENOS MENOS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astForD($4,$6,$8,$10,$15); }
	| error { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
    | IDENTIFICADOR IGUAL expresion_cadena PTCOMA		                                  { $$ = API.astAsignacion($1, $3); } 
	| if  { $$ = API.astRif($1); }
	| if else_if {  $$ = API.astElseifC($1 , $2); }
    | if else {  $$ = API.astElseC($1 , $2); }
	| if else_if else { $$ = API.astIfCompleto($1, $2 , $3); }                                                        
	| SWITCH PARIZQ expresion_numerica PARDER LLAVIZQ casos LLAVDER
		{ $$ = API.astSwitch($3,$6);}
    | DO LLAVIZQ instrucciones_break LLAVDER WHILE PARIZQ expresion_logica PARDER PTCOMA { $$ = API.astDoWhile( $7, $3); } 
    | BREAK PTCOMA   { $$ = API.astBreak( $1); }
    | CONTINUE PTCOMA { $$ = astContinue($1); }
    | SOUT PARIZQ expresion_cadena PARDER PTCOMA            { $$ = API.astSout($3); }
    | SOUTLN PARIZQ expresion_cadena PARDER PTCOMA          { $$ = API.astSout($3); }
    | llamada_metodo   PTCOMA                                 { $$ = $1; }

;


instrucciones_int
	: instrucciones_int instruccionint 	{ $1.push($2); $$ = $1; }
	| instruccionint					    { $$ = [$1]; }
;

instruccionint
    : RINT     identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.ENTERO , [$2]); }
    | RINT     identificador IGUAL  expresion_numerica PTCOMA                             { $$ = API.astDeclaracion( TIPO_VALOR.ENTERO , $2 , $4 ); }
    | RSTRING  identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.CADENA , $2); }
    | RSTRING  identificador IGUAL  expresion_cadena PTCOMA                               { $$ = API.astDeclaracion( TIPO_VALOR.CADENA , $2 , $4 ); }
    | RBOOLEAN identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.BOOLEANO , $2); }
    | RBOOLEAN identificador IGUAL  expresion_logica PTCOMA                               { $$ = API.astDeclaracion( TIPO_VALOR.BOOLEANO , $2 , $4 ); }
    | RDOUBLE  identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.DOUBLE , $2); }
    | RDOUBLE  identificador IGUAL  expresion_numerica PTCOMA                             { $$ = API.astDeclaracion( TIPO_VALOR.DOUBLE , $2 , $4 ); }
    | RCHAR    identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.CARACTER , $2); }
    | RCHAR    identificador IGUAL  CHAR PTCOMA                                           { $$ = API.astDeclaracion( TIPO_VALOR.CARACTER , $2 , $4 ); }
	| WHILE PARIZQ expresion_logica PARDER LLAVIZQ instrucciones_break LLAVDER { $$ = API.astWhile($3, $6); }	
    | FOR PARIZQ IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MAS MAS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astFor($3,$5,$7,$9,$14); }
	| FOR PARIZQ RINT IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MAS MAS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astFor($4,$6,$8,$10,$15); }
    | FOR PARIZQ IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MENOS MENOS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astForD($3,$5,$7,$9,$14); }
	| FOR PARIZQ RINT IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MENOS MENOS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astForD($4,$6,$8,$10,$15); }
	| error { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
    | IDENTIFICADOR IGUAL expresion_cadena PTCOMA		                                  { $$ = API.astAsignacion($1, $3); } 
	| if  { $$ = API.astRif($1); }
	| if else_if {  $$ = API.astElseifC($1 , $2); }
    | if else {  $$ = API.astElseC($1 , $2); }
	| if else_if else { $$ = API.astIfCompleto($1, $2 , $3); }                                                        
	| SWITCH PARIZQ expresion_numerica PARDER LLAVIZQ casos LLAVDER
		{ $$ = API.astSwitch($3,$6);}
    | DO LLAVIZQ instrucciones_break LLAVDER WHILE PARIZQ expresion_logica PARDER PTCOMA { $$ = API.astDoWhile( $7, $3); } 
    | RETURN expresion_cadena  { $$ = API.astReturn(TIPO_VALOR.ENTERO , $2); }
    | SOUT PARIZQ expresion_cadena PARDER PTCOMA            { $$ = API.astSout($3); }
    | SOUTLN PARIZQ expresion_cadena PARDER PTCOMA          { $$ = API.astSout($3); }    
    | llamada_metodo   PTCOMA                                 { $$ = $1; }

;



instrucciones_cadena
	: instrucciones_cadena instruccioncad 	{ $1.push($2); $$ = $1; }
	| instruccioncad					    { $$ = [$1]; }
;

instruccioncad
    : RINT     identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.ENTERO , [$2]); }
    | RINT     identificador IGUAL  expresion_numerica PTCOMA                             { $$ = API.astDeclaracion( TIPO_VALOR.ENTERO , $2 , $4 ); }
    | RSTRING  identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.CADENA , $2); }
    | RSTRING  identificador IGUAL  expresion_cadena PTCOMA                               { $$ = API.astDeclaracion( TIPO_VALOR.CADENA , $2 , $4 ); }
    | RBOOLEAN identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.BOOLEANO , $2); }
    | RBOOLEAN identificador IGUAL  expresion_logica PTCOMA                               { $$ = API.astDeclaracion( TIPO_VALOR.BOOLEANO , $2 , $4 ); }
    | RDOUBLE  identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.DOUBLE , $2); }
    | RDOUBLE  identificador IGUAL  expresion_numerica PTCOMA                             { $$ = API.astDeclaracion( TIPO_VALOR.DOUBLE , $2 , $4 ); }
    | RCHAR    identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.CARACTER , $2); }
    | RCHAR    identificador IGUAL  CHAR PTCOMA                                           { $$ = API.astDeclaracion( TIPO_VALOR.CARACTER , $2 , $4 ); }
	| WHILE PARIZQ expresion_logica PARDER LLAVIZQ instrucciones_break LLAVDER { $$ = API.astWhile($3, $6); }	
    | FOR PARIZQ IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MAS MAS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astFor($3,$5,$7,$9,$14); }
	| FOR PARIZQ RINT IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MAS MAS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astFor($4,$6,$8,$10,$15); }
    | FOR PARIZQ IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MENOS MENOS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astForD($3,$5,$7,$9,$14); }
	| FOR PARIZQ RINT IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MENOS MENOS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astForD($4,$6,$8,$10,$15); }
	| error { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
    | IDENTIFICADOR IGUAL expresion_cadena PTCOMA		                                  { $$ = API.astAsignacion($1, $3); } 
	| if  { $$ = API.astRif($1); }
	| if else_if {  $$ = API.astElseifC($1 , $2); }
    | if else {  $$ = API.astElseC($1 , $2); }
	| if else_if else { $$ = API.astIfCompleto($1, $2 , $3); }                                                        
	| SWITCH PARIZQ expresion_numerica PARDER LLAVIZQ casos LLAVDER
		{ $$ = API.astSwitch($3,$6);}
    | DO LLAVIZQ instrucciones_break LLAVDER WHILE PARIZQ expresion_logica PARDER PTCOMA { $$ = API.astDoWhile( $7, $3); } 
    | RETURN expresion_cadena  { $$ = API.astReturn(TIPO_VALOR.CADENA , $2); }
    | SOUT PARIZQ expresion_cadena PARDER PTCOMA            { $$ = API.astSout($3); }
    | SOUTLN PARIZQ expresion_cadena PARDER PTCOMA          { $$ = API.astSout($3); }    
    | llamada_metodo   PTCOMA                                 { $$ = $1; }
;

instrucciones_boolean
	: instrucciones_boolean instruccionboo 	{ $1.push($2); $$ = $1; }
	| instruccionboo					    { $$ = [$1]; }
;

instruccionboo
    : RINT     identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.ENTERO , [$2]); }
    | RINT     identificador IGUAL  expresion_numerica PTCOMA                             { $$ = API.astDeclaracion( TIPO_VALOR.ENTERO , $2 , $4 ); }
    | RSTRING  identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.CADENA , $2); }
    | RSTRING  identificador IGUAL  expresion_cadena PTCOMA                               { $$ = API.astDeclaracion( TIPO_VALOR.CADENA , $2 , $4 ); }
    | RBOOLEAN identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.BOOLEANO , $2); }
    | RBOOLEAN identificador IGUAL  expresion_logica PTCOMA                               { $$ = API.astDeclaracion( TIPO_VALOR.BOOLEANO , $2 , $4 ); }
    | RDOUBLE  identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.DOUBLE , $2); }
    | RDOUBLE  identificador IGUAL  expresion_numerica PTCOMA                             { $$ = API.astDeclaracion( TIPO_VALOR.DOUBLE , $2 , $4 ); }
    | RCHAR    identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.CARACTER , $2); }
    | RCHAR    identificador IGUAL  CHAR PTCOMA                                           { $$ = API.astDeclaracion( TIPO_VALOR.CARACTER , $2 , $4 ); }
	| WHILE PARIZQ expresion_logica PARDER LLAVIZQ instrucciones_break LLAVDER { $$ = API.astWhile($3, $6); }	
    | FOR PARIZQ IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MAS MAS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astFor($3,$5,$7,$9,$14); }
	| FOR PARIZQ RINT IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MAS MAS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astFor($4,$6,$8,$10,$15); }
    | FOR PARIZQ IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MENOS MENOS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astForD($3,$5,$7,$9,$14); }
	| FOR PARIZQ RINT IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MENOS MENOS PARDER LLAVIZQ instrucciones_break LLAVDER
														{ $$ = API.astForD($4,$6,$8,$10,$15); }
	| error { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
    | IDENTIFICADOR IGUAL expresion_cadena PTCOMA		                                  { $$ = API.astAsignacion($1, $3); } 
	| if  { $$ = API.astRif($1); }
	| if else_if {  $$ = API.astElseifC($1 , $2); }
    | if else {  $$ = API.astElseC($1 , $2); }
	| if else_if else { $$ = API.astIfCompleto($1, $2 , $3); }                                                        
	| SWITCH PARIZQ expresion_numerica PARDER LLAVIZQ casos LLAVDER
		{ $$ = API.astSwitch($3,$6);}
    | DO LLAVIZQ instrucciones_break LLAVDER WHILE PARIZQ expresion_logica PARDER PTCOMA { $$ = API.astDoWhile( $7, $3); } 
    | RETURN expresion_cadena  { $$ = API.astReturn(TIPO_VALOR.BOOLEANO , $2); }
    | SOUT PARIZQ expresion_cadena PARDER PTCOMA            { $$ = API.astSout($3); }
    | SOUTLN PARIZQ expresion_cadena PARDER PTCOMA          { $$ = API.astSout($3); }
    | llamada_metodo   PTCOMA                                 { $$ = $1; }

;


if 
    : IF PARIZQ expresion_logica PARDER LLAVIZQ instrucciones_break LLAVDER { $$ = API.astIf($3, $6); }
;

else    
    : ELSE LLAVIZQ instrucciones_break LLAVDER { $$ = API.astElse($3); } 
;

else_if
    :else_if elif { $1.push($2); $$ = $1; }
    | elif { $$ = API.astelif($1); }
;
elif
    : ELSE IF PARIZQ expresion_logica PARDER LLAVIZQ instrucciones_break LLAVDER { $$ = API.astElseif( $4, $7); }
;


casos : casos caso_evaluar
    {
      $1.push($2);
	  $$ = $1;
    }
  | caso_evaluar
  	{ $$ = API.astCases($1);}
;

caso_evaluar : CASE expresion_numerica DOSPTS instrucciones_break
    { $$ = API.astCase($2,$4); }
  | DEFAULT DOSPTS instrucciones_break
    { $$ = API.astCaseDef($3); }
;

operadores
    : O_MAS      { $$ = API.nuevoOperador(TIPO_OPERACION.SUMA); }
	| O_MENOS    { $$ = API.nuevoOperador(TIPO_OPERACION.RESTA); }
    | O_POR      { $$ = API.nuevoOperador(TIPO_OPERACION.MULTIPLICACION); }
	| O_DIVIDIDO { $$ = API.nuevoOperador(TIPO_OPERACION.DIVISION); }
;


expresion_numerica
	: MENOS expresion_numerica %prec UMENOS				{ $$ = API.nuevoOperacionUnaria($2, TIPO_OPERACION.NEGATIVO); }
	| expresion_numerica MAS expresion_numerica			{ $$ = API.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.SUMA); }
	| expresion_numerica MENOS expresion_numerica		{ $$ = API.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.RESTA); }
	| expresion_numerica POR expresion_numerica			{ $$ = API.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MULTIPLICACION); }
	| expresion_numerica DIVIDIDO expresion_numerica	{ $$ = API.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.DIVISION); }
	| PARIZQ expresion_numerica PARDER					{ $$ = $2; }
	| ENTERO											{ $$ = API.nuevoValor(Number($1), TIPO_VALOR.ENTERO); }
	| DECIMAL											{ $$ = API.nuevoValor(Number($1), TIPO_VALOR.DOUBLE); }
	| IDENTIFICADOR										{ $$ = API.nuevoValor($1, TIPO_VALOR.IDENTIFICADOR); }
    | llamada_metodo                                   { $$ = $1; }
;

expresion_cadena
	: expresion_cadena CONCAT expresion_cadena			{ $$ = API.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.CONCATENACION); }
	| CADENA											{ $$ = API.nuevoValor($1, TIPO_VALOR.CADENA); }
	| CHAR											    { $$ = API.nuevoValor($1, TIPO_VALOR.CARACTER); }
	| expresion_numerica								{ $$ = $1; }
;

expresion_relacional
	: expresion_numerica MAYQUE expresion_numerica		{ $$ = API.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MAYOR_QUE); }
	| expresion_numerica MENQUE expresion_numerica		{ $$ = API.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MENOR_QUE); }
	| expresion_numerica MAYIGQUE expresion_numerica	{ $$ = API.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MAYOR_IGUAL); }
	| expresion_numerica MENIGQUE expresion_numerica	{ $$ = API.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MENOR_IGUAL); }
	| expresion_cadena DOBLEIG expresion_cadena			{ $$ = API.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.DOBLE_IGUAL); }
	| expresion_cadena NOIG expresion_cadena			{ $$ = API.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.NO_IGUAL); }
;

expresion_logica
	: expresion_relacional AND expresion_relacional     { $$ = API.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.AND); }
	| expresion_relacional OR expresion_relacional 		{ $$ = API.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.OR); }
	| NOT expresion_relacional							{ $$ = API.nuevoOperacionUnaria($2, TIPO_OPERACION.NOT); }
	| expresion_relacional								{ $$ = $1; }
    | BOOLT									        	{ $$ = API.nuevoValor($1, TIPO_VALOR.BOOLEANO); }
    | BOOLF									        	{ $$ = API.nuevoValor($1, TIPO_VALOR.BOOLEANO); }    
;


llamada_metodo
    : IDENTIFICADOR PARIZQ valores PARDER        { $$ = API.astLlamadaM($1 , $3); }
;

valores
    : valores COMA valor { $$ = API.astValores($2); }
    | valor { $$ = $1; }
;

valor
    : expresion_cadena         { $$ = API.astValor($1); }
    | expresion_logica         { $$ = API.astValor($1); }
;

