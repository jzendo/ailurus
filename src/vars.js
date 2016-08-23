/* Temp disable eslint for Regexp */
/* eslint-disable max-len */

// Phrase Regexp
export const RE_PHRASE_BLOCK = /{{([^}]*)}}/;
export const RE_PHRASE_SINGLE_BLOCK = /{{([a-zA-Z_][a-zA-Z0-9_]*)}}/;
export const RE_PHRASE_COMPLEX_BEGIN_BLOCK = /{{#([a-zA-Z][a-zA-Z0-9]*)\s+([^}]*)}}/;
export const RE_PHRASE_COMPLEX_END_BLOCK = /{{\/([a-zA-Z_][a-zA-Z0-9_]*)}}/;

export const RE_SPECIALCHARS_HEADTAIL = /^(([\t\s]|(\\r\\n)|(\\n))+)|(([\t\s]|(\\r\\n)|(\\n))+)$/g;
export const RE_SPECIALCHARS_STRIP = /([\t])+|(\s){2,}|(\\r\\n)+|(\\n)+/g;
/* eslint-enable max-len */

// The key of endblock's parser
export const PHRASE_PARSER_ENDCOMPLEXBLOCK = "__$";
// The key of single-block's parser
export const PHRASE_PARSER_SINGLEBLOCK = "___";
// safehtml function name
export const EMBEDDEDSAFEHTML_FN_NAME = "_h";
