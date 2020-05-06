
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
"void"              return 'VOID';
"true"              return 'BOOLT';
"false"             return 'BOOLF';

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
	const TIPO_OPERACION	= require('./instrucciones').TIPO_OPERACION;
	const TIPO_VALOR 		= require('./instrucciones').TIPO_VALOR;
	const TIPO_DATO			= require('./tabla_simbolos').TIPO_DATO; //para jalar el tipo de dato
	const API	= require('./instrucciones').instruccionesAPI;
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
    : imports clases { $1.push($2); $$ = $1; }

imports 
    : imports import { $1.push($2) , $$ = $1; }
    | import { $$ = $1 ;} 
    |
;

import
    : IMPORT IDENTIFICADOR { $$ = instruccionesAPI.nuevoImport($2) ; }


clases
    : clases clase { $1.push($2) , $$ = $1; }
    | clase { $$ = $1; }
;

clase 
    : CLASS IDENTIFICADOR LLAVIZQ instrucciones LLAVDER { $$ = instruccionesAPI.nuevaClase($2 , [$4]) ; }
;

instrucciones_clase
    :instrucciones_clase instruccion_clase { $1.push($2);  $$ = $1; }
    |instruccion_clase                     { $$ = [$1]; }
;

instruccion_clase
    : RINT     identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.ENTERO , [$2]); }
    | RINT     identificador IGUAL  expresion_numerica PTCOMA                             { $$ = API.astDeclaracion( TIPO_VALOR.ENTERO , $2 , $4 ); }
    | RINT     IDENTIFICADOR PARIZQ parametros PARDER LLAVIZQ instrucciones LLAVDER { $$ = API.astFuncion(TIPO_DATO.ENTERO , $2 , $4, $7); }
    | RSTRING  identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.CADENA , $2); }
    | RSTRING  identificador IGUAL  expresion_cadena PTCOMA                             { $$ = API.astDeclaracion( TIPO_VALOR.CADENA , $2 , $4 ); }
    | RSTRING  IDENTIFICADOR PARIZQ parametros PARDER LLAVIZQ instrucciones LLAVDER { $$ = API.astFuncion(TIPO_VALOR.CADENA , $2 , $4, $7);}
    | RBOOLEAN identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.BOOLEANO , $2); }
    | RBOOLEAN identificador IGUAL  expresion_logica PTCOMA                             { $$ = API.astDeclaracion( TIPO_VALOR.BOOLEANO , $2 , $4 ); }
    | RBOOLEAN IDENTIFICADOR PARIZQ parametros PARDER LLAVIZQ instrucciones LLAVDER { $$ = API.astFuncion(TIPO_VALOR.BOOLEANO , $2 , $4, $7); } 
    | RDOUBLE  identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.DOUBLE , $2); }
    | RDOUBLE  identificador IGUAL  expresion_numerica PTCOMA                             { $$ = API.astDeclaracion( TIPO_VALOR.DOUBLE , $2 , $4 ); }
    | RDOUBLE  IDENTIFICADOR PARIZQ parametros PARDER LLAVIZQ instrucciones LLAVDER { $$ = API.astFuncion(TIPO_VALOR.DOUBLE , $2 , $4, $7); }
    | RCHAR    identificador PTCOMA                                                       { $$ = API.astDeclaN( TIPO_VALOR.CARACTER , $2); }
    | RCHAR    identificador IGUAL  CHAR PTCOMA                                           { $$ = API.astDeclaracion( TIPO_VALOR.CARACTER , $2 , $4 ); }
    | RCHAR    IDENTIFICADOR PARIZQ parametros PARDER LLAVIZQ instrucciones LLAVDER { $$ = API.astFuncion(TIPO_VALOR.CARACTER , $2 , $4, $7); }
    | IDENTIFICADOR IGUAL valor_decla PTCOMA		                                      { $$ = API.astAsignacion($1, $3); } 
;

parametros
    :parametro lista_param      { $1.push($2); $$ = $1; }
    |
;

parametro
    :RINT IDENTIFICADOR         { $$ = API.astParametro( TIPO_DATO.ENTERO , $2); }
    |RSTRING IDENTIFICADOR      { $$ = API.astParametro( TIPO_DATO.CADENA , $2); }
    |RBOOLEAN IDENTIFICADOR     { $$ = API.astParametro( TIPO_DATO.BOOLEANO , $2); }
    |RDOUBLE IDENTIFICADOR      { $$ = API.astParametro( TIPO_DATO.DOUBLE , $2); }
    |RCHAR IDENTIFICADOR        { $$ = API.astParametro( TIPO_DATO.CARACTER  , $2); }
;

lista_param
    : lista_param COMA parametro { $1.push($3); $$ = $1; }
    | COMA parametro             { $$ =  $2;  }
    |
;

identificador
    :IDENTIFICADOR lista_identificadores       { $1 = API.astListaIden($1) ; $1.push($2) ; $$ = $1 ;}
;

lista_identificadores
    : lista_identificadores COMA IDENTIFICADOR { $1.push(API.astListaIden($2)); $$ = $1; }
    | COMA IDENTIFICADOR                       { $$ = API.astListaIden($2); }
    |
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
	| WHILE PARIZQ expresion_logica PARDER LLAVIZQ instrucciones LLAVDER { $$ = API.astWhile($3, $6); }	
    | FOR PARIZQ IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MAS MAS PARDER LLAVIZQ instrucciones LLAVDER
														{ $$ = API.astFor($3,$5,$7,$9,$14); }
	| FOR PARIZQ RINT IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MAS MAS PARDER LLAVIZQ instrucciones LLAVDER
														{ $$ = API.astFor($4,$6,$8,$10,$15); }
    | FOR PARIZQ IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MENOS MENOS PARDER LLAVIZQ instrucciones LLAVDER
														{ $$ = API.astForD($3,$5,$7,$9,$14); }
	| FOR PARIZQ RINT IDENTIFICADOR IGUAL expresion_numerica PTCOMA expresion_logica PTCOMA IDENTIFICADOR MENOS MENOS PARDER LLAVIZQ instrucciones LLAVDER
														{ $$ = API.astForD($4,$6,$8,$10,$15); }

    | IDENTIFICADOR IGUAL valor_decla PTCOMA		                                  { $$ = API.astAsignacion($1, $3); } 
	| if  { $$ = $1; )}
	| if else_if { $1.push($2); $$ = $1; )}
	| if else_if else { $1.push($2); $1.push($3); $$ = $1; )}                                                        
	| SWITCH PARIZQ expresion_numerica PARDER LLAVIZQ casos LLAVDER
		{ $$ = API.astSwitch($3,$6);}
    | DO LLAVIZQ instrucciones LLAVDER WHILE PARIZQ expresion_logica PARDER PTCOMA { $$ = API.astDoWhile( $7, $3); }
    | 
	| error { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
;

valor_decla
    :expresion_cadena { $$ = $1 ;}
    |expresion_logica { $$ = $1 ;}
    |CHAR { $$ = $1 ;}        
if 
    : IF PARIZQ expresion_logica PARDER LLAVIZQ instrucciones LLAVDER { $$ = API.astIf($3, $6); }
;

else    
    : ELSE LLAVIZQ instrucciones LLAVDER { $$ = API.astElse($3); } 
;

else_if
    :else_if elif { $1.push($2); $$ = $1; }
    | elif { $$ = $1; }
;
elif
    : ELSE IF PARIZQ expresion_logica PARDER LLAVIZQ instrucciones LLAVDER { $$ = API.astIf( $4, $7); }
;
casos : casos caso_evaluar
    {
      $1.push($2);
	  $$ = $1;
    }
  | caso_evaluar
  	{ $$ = API.astCases($1);}
;

caso_evaluar : RCASE expresion_numerica DOSPTS instrucciones
    { $$ = API.astCase($2,$4); }
  | RDEFAULT DOSPTS instrucciones
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
	| ENTERO											{ $$ = API.nuevoValor(Number($1), TIPO_VALOR.NUMERO); }
	| DECIMAL											{ $$ = API.nuevoValor(Number($1), TIPO_VALOR.NUMERO); }
	| IDENTIFICADOR										{ $$ = API.nuevoValor($1, TIPO_VALOR.IDENTIFICADOR); }
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
    | BOOLT										{ $$ = API.nuevoValor($1, TIPO_VALOR.BOOLEANO); }
    | BOOLF										{ $$ = API.nuevoValor($1, TIPO_VALOR.BOOLEANO); }    
;
