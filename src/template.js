import {
  RE_PHRASE_COMPLEX_BEGIN_BLOCK,
  RE_PHRASE_SINGLE_BLOCK,
  RE_PHRASE_BLOCK,
  RE_PHRASE_COMPLEX_END_BLOCK,
  PHRASE_PARSER_ENDCOMPLEXBLOCK,
  PHRASE_PARSER_SINGLEBLOCK,
  EMBEDDEDSAFEHTML_FN_NAME
} from "./vars";

import * as util from "./util";
import parser from "./parser";

const DEBUG = true;

// Show debug or not.
let console;

if (DEBUG === false) {
  console = {
    log: () => {}
  };
} else if (typeof window !== "undefined" && window.document) {
  console = window.console;
} else {
  console = global.console;
}

let walk = {
  Q_: [],
  start: () => {
    walk.Q_ = ["var q = [];"];
    return walk;
  },
  step: function() { // As arguments, do not use arrow fn.
    walk.Q_.push.apply(walk.Q_, arguments);
    return walk;
  },
  end: () => {
    walk.Q_.push("return q.join(\"\");");
    return walk;
  },
  toString: () => {
    return walk.Q_.join("");
  }
};

let queueFragment = str => {
  str = util.reduceSpecialChars(str);
  if (str)
    return "q.push(\"" + str + "\");";
  return "";
};

let parse = str => {
  let found = false;
  str.replace(RE_PHRASE_BLOCK, (entity, matched, pos, str) => {
    found = true;
    let len = entity.length;
    let type;
    let condition;

    walk.step(queueFragment(str.substring(0, pos)));

    if (RE_PHRASE_COMPLEX_END_BLOCK.test(entity)) {
      type = PHRASE_PARSER_ENDCOMPLEXBLOCK;
      condition = matched.substring(1); // Strip "/"
    } else if (RE_PHRASE_SINGLE_BLOCK.test(entity)) {
      type = PHRASE_PARSER_SINGLEBLOCK;
      condition = matched;
    } else {
      matched = entity.match(RE_PHRASE_COMPLEX_BEGIN_BLOCK);
      if (matched) {
        type = matched[1];
        condition = matched[2];
      } else {
        throw new Error("The \"" + entity + "\" block is invalid.");
      }
    }
    // Call parser.
    if (util.hasOwn(parser, type)) {
      walk.step(parser[type](condition));
    } else {
      throw new Error("The \"" + type + "\" is undefined.");
    }
    // Parse remain.
    parse(str.substring(pos + len));
  });

  if (!found) {
    walk.step(queueFragment(str));
  }
};

/* eslint-disable no-new-func */
let templateFn = strFnBody => Function("context", strFnBody);
/* eslint-enable no-new-func */

// Structure function body.
let templateFnBody = () => {
  let prePadding = "var " + EMBEDDEDSAFEHTML_FN_NAME + "=" +
      util.safeHtml.toString() + ";\n";

  let strParsingBody = walk.toString();
  return prePadding + strParsingBody;
};

/*
 * Entry
 */
let template = function(tpl, context) {
  if (!tpl) {
    return "";
  }

  // To json string
  tpl = util.stringify(tpl);
  // Strip "
  tpl = tpl.substring(1, tpl.length - 1);
  tpl = util.trimHeadAndTail(tpl);
  // console.log(">> Template text: ", tpl);
  // Walk template
  walk.start();
  parse(tpl);
  walk.end();
  // console.log("Parsed result:\n\n", walk.toString());
  return context ?
      (templateFn(templateFnBody())(context)) :
      templateFn(templateFnBody());
};

export default template;
