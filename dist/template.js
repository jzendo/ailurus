(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("simpleTemplate", [], factory);
	else if(typeof exports === 'object')
		exports["simpleTemplate"] = factory();
	else
		root["simpleTemplate"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _vars = __webpack_require__(1);

	var _util = __webpack_require__(2);

	var util = _interopRequireWildcard(_util);

	var _parser = __webpack_require__(3);

	var _parser2 = _interopRequireDefault(_parser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var DEBUG = true;

	// Show debug or not.
	var console = void 0;

	if (DEBUG === false) {
	  console = {
	    log: function log() {}
	  };
	} else if (typeof window !== "undefined" && window.document) {
	  console = window.console;
	} else {
	  console = global.console;
	}

	var walk = {
	  Q_: [],
	  start: function start() {
	    walk.Q_ = ["var q = [];"];
	    return walk;
	  },
	  step: function step() {
	    // As arguments, do not use arrow fn.
	    walk.Q_.push.apply(walk.Q_, arguments);
	    return walk;
	  },
	  end: function end() {
	    walk.Q_.push("return q.join(\"\");");
	    return walk;
	  },
	  toString: function toString() {
	    return walk.Q_.join("");
	  }
	};

	var queueFragment = function queueFragment(str) {
	  str = util.reduceSpecialChars(str);
	  if (str) return "q.push(\"" + str + "\");";
	  return "";
	};

	var parse = function parse(str) {
	  var found = false;
	  str.replace(_vars.RE_PHRASE_BLOCK, function (entity, matched, pos, str) {
	    found = true;
	    var len = entity.length;
	    var type = void 0;
	    var condition = void 0;

	    walk.step(queueFragment(str.substring(0, pos)));

	    if (_vars.RE_PHRASE_COMPLEX_END_BLOCK.test(entity)) {
	      type = _vars.PHRASE_PARSER_ENDCOMPLEXBLOCK;
	      condition = matched.substring(1); // Strip "/"
	    } else if (_vars.RE_PHRASE_SINGLE_BLOCK.test(entity)) {
	      type = _vars.PHRASE_PARSER_SINGLEBLOCK;
	      condition = matched;
	    } else {
	      matched = entity.match(_vars.RE_PHRASE_COMPLEX_BEGIN_BLOCK);
	      if (matched) {
	        type = matched[1];
	        condition = matched[2];
	      } else {
	        throw new Error("The \"" + entity + "\" block is invalid.");
	      }
	    }
	    // Call parser.
	    if (util.hasOwn(_parser2.default, type)) {
	      walk.step(_parser2.default[type](condition));
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
	var templateFn = function templateFn(strFnBody) {
	  return Function("context", strFnBody);
	};
	/* eslint-enable no-new-func */

	// Structure function body.
	var templateFnBody = function templateFnBody() {
	  var prePadding = "var " + _vars.EMBEDDEDSAFEHTML_FN_NAME + "=" + util.safeHtml.toString() + ";\n";

	  var strParsingBody = walk.toString();
	  return prePadding + strParsingBody;
	};

	/*
	 * Entry
	 */
	var template = function template(tpl, context) {
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
		console.log(templateFnBody());
	  // console.log("Parsed result:\n\n", walk.toString());
	  return context ? templateFn(templateFnBody())(context) : templateFn(templateFnBody());
	};

	exports.default = template;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/* Temp disable eslint for Regexp */
	/* eslint-disable max-len */

	// Phrase Regexp
	var RE_PHRASE_BLOCK = exports.RE_PHRASE_BLOCK = /{{([^}]*)}}/;
	var RE_PHRASE_SINGLE_BLOCK = exports.RE_PHRASE_SINGLE_BLOCK = /{{([a-zA-Z_][a-zA-Z0-9_]*)}}/;
	var RE_PHRASE_COMPLEX_BEGIN_BLOCK = exports.RE_PHRASE_COMPLEX_BEGIN_BLOCK = /{{#([a-zA-Z][a-zA-Z0-9]*)\s+([^}]*)}}/;
	var RE_PHRASE_COMPLEX_END_BLOCK = exports.RE_PHRASE_COMPLEX_END_BLOCK = /{{\/([a-zA-Z_][a-zA-Z0-9_]*)}}/;

	var RE_SPECIALCHARS_HEADTAIL = exports.RE_SPECIALCHARS_HEADTAIL = /^(([\t\s]|(\\r\\n)|(\\n))+)|(([\t\s]|(\\r\\n)|(\\n))+)$/g;
	var RE_SPECIALCHARS_STRIP = exports.RE_SPECIALCHARS_STRIP = /([\t])+|(\s){2,}|(\\r\\n)+|(\\n)+/g;
	/* eslint-enable max-len */

	// The key of endblock's parser
	var PHRASE_PARSER_ENDCOMPLEXBLOCK = exports.PHRASE_PARSER_ENDCOMPLEXBLOCK = "__$";
	// The key of single-block's parser
	var PHRASE_PARSER_SINGLEBLOCK = exports.PHRASE_PARSER_SINGLEBLOCK = "___";
	// safehtml function name
	var EMBEDDEDSAFEHTML_FN_NAME = exports.EMBEDDEDSAFEHTML_FN_NAME = "_h";

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.safeHtml = exports.hasOwn = exports.parse = exports.stringify = exports.reduceSpecialChars = exports.trimHeadAndTail = undefined;

	var _vars = __webpack_require__(1);

	var trimHeadAndTail = exports.trimHeadAndTail = function trimHeadAndTail(str) {
	  return str.replace(_vars.RE_SPECIALCHARS_HEADTAIL, "");
	};

	var reduceSpecialChars = exports.reduceSpecialChars = function reduceSpecialChars(str) {
	  return str.replace(_vars.RE_SPECIALCHARS_STRIP, function (matchedEntity, mathed0, mathed1) {
	    return mathed1 || mathed0 || "";
	  });
	};

	var stringify = exports.stringify = function stringify(obj) {
	  return JSON.stringify(obj);
	};

	var parse = exports.parse = function parse(str) {
	  return JSON.parse(str);
	};

	var hasOwn = exports.hasOwn = function hasOwn(o, p) {
	  if (!o) {
	    return false;
	  } else if (Object.prototype.hasOwnProperty.call(o, p)) {
	    return true;
	  }
	  return false;
	};

	// Inspired by Handlebar.js

	// {object} escapeChars:
	// Closure definition for embedded (Using safeHtml.toString)
	var safeHtml = exports.safeHtml = function safeHtml(html) {
	  var escapeChars = {
	    "&": "&amp;",
	    "<": "&lt;",
	    ">": "&gt;",
	    "\"": "&quot;",
	    "'": "&#x27;",
	    "`": "&#x60;",
	    "=": "&#x3D;"
	  };
	  if (html === null || html === undefined) {
	    html = "";
	  } else {
	    html = String(html);
	  }
	  return html.replace(/[&<>"'`=]/g, function (c) {
	    return escapeChars[c];
	  });
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _vars = __webpack_require__(1);

	// Generate with context.
	var genConditionFn = function genConditionFn(condition) {
	  /* eslint-disable no-new-func */

	  // Use 'with' expression to eval condition not complicated.
	  // *TODO: condition should be escaped from this/window/document/etc..
	  return Function("context", "with(context){ return (" + condition + ");}");

	  /* eslint-enable no-new-func */
	};

	var phraseEach = function phraseEach(condition) {
	  // condition is the key.
	  // items = context[condition];
	  var parsedCondition = genConditionFn(condition);

	  return "(function(context){var tmpQ = q; q = [];" + "var items= (" + parsedCondition.toString() + "(context));" + "var tmpContext = context;" + "var i = 0, len1 = items.length;" + "if(len1) q = [\"<ul>\"];" + "for (; i < len1; i+=1){" + "if (i == 0) q.push(\"<li>\"); else q.push(\"</li><li>\");" + "context = items[i];";
	};

	var phraseIf = function phraseIf(condition) {
	  var parsedCondition = genConditionFn(condition);
	  return "if ((" + parsedCondition.toString() + "(context))) {";
	};

	var phraseSingle = function phraseSingle(condition) {
	  return "q.push(" + _vars.EMBEDDEDSAFEHTML_FN_NAME + "(context[\"" + condition + "\"])" + ");";
	};

	var phraseBlockEnd = function phraseBlockEnd(condition) {
	  if (condition === "each") {
	    return "};context = tmpContext;" + "tmpQ.push(q.length ? q.join(\"\") + \"</li></ul>\" : \"\");" + "q = tmpQ;" + "tmpContext = tmpQ = null;" + "}(context));";
	  }
	  return "}";
	};

	// Export object

	/* eslint-disable dot-notation */
	var parser = {};
	// Not dot notation, as if reserved word
	parser[_vars.PHRASE_PARSER_SINGLEBLOCK] = phraseSingle;
	parser[_vars.PHRASE_PARSER_ENDCOMPLEXBLOCK] = phraseBlockEnd;

	parser["each"] = phraseEach;
	parser["if"] = phraseIf;
	/* eslint-enable */

	exports.default = parser;

/***/ }
/******/ ])
});
;