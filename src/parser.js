import {
  PHRASE_PARSER_ENDCOMPLEXBLOCK,
  PHRASE_PARSER_SINGLEBLOCK,
  EMBEDDEDSAFEHTML_FN_NAME
} from "./vars";

// Generate with context.
const genConditionFn = condition => {
  /* eslint-disable no-new-func */

  // Use 'with' expression to eval condition not complicated.
  // *TODO: condition should be escaped from this/window/document/etc..
  return Function("context", "with(context){ return (" + condition + ");}");

  /* eslint-enable no-new-func */
};

const phraseEach = condition => {
  // condition is the key.
  // items = context[condition];
  let parsedCondition = genConditionFn(condition);

  return "(function(context){var tmpQ = q; q = [];" +
            "var items= (" + parsedCondition.toString() + "(context));" +
            "var tmpContext = context;" +
            "var i = 0, len1 = items.length;" +
            "if(len1) q = [\"<ul>\"];" +
            "for (; i < len1; i+=1){" +
            "if (i == 0) q.push(\"<li>\"); else q.push(\"</li><li>\");" +
            "context = items[i];";
};

const phraseIf = condition => {
  let parsedCondition = genConditionFn(condition);
  return "if ((" + parsedCondition.toString() + "(context))) {";
};

const phraseSingle = condition => {
  return "q.push(" + EMBEDDEDSAFEHTML_FN_NAME +
        "(context[\"" + condition + "\"])" +
      ");";
};

const phraseBlockEnd = condition => {
  if (condition === "each") {
    return "};context = tmpContext;" +
           "tmpQ.push(q.length ? q.join(\"\") + \"</li></ul>\" : \"\");" +
           "q = tmpQ;" +
           "tmpContext = tmpQ = null;" +
        "}(context));";
  }
  return "}";
};

// Export object

/* eslint-disable dot-notation */
const parser = {};
// Not dot notation, as if reserved word
parser[PHRASE_PARSER_SINGLEBLOCK] = phraseSingle;
parser[PHRASE_PARSER_ENDCOMPLEXBLOCK] = phraseBlockEnd;

parser["each"] = phraseEach;
parser["if"] = phraseIf;
/* eslint-enable */

export default parser;
