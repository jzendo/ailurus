import {RE_SPECIALCHARS_HEADTAIL, RE_SPECIALCHARS_STRIP} from "./vars";

export const trimHeadAndTail = str => {
  return str.replace(RE_SPECIALCHARS_HEADTAIL, "");
};

export const reduceSpecialChars = str => {
  return str.replace(RE_SPECIALCHARS_STRIP,
    function(matchedEntity, mathed0, mathed1) {
      return mathed1 || mathed0 || "";
    });
};

export const stringify = obj => {
  return JSON.stringify(obj);
};

export const parse = str => {
  return JSON.parse(str);
};

export const hasOwn = (o, p) => {
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
export const safeHtml = html => {
  const escapeChars = {
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
  return html.replace(/[&<>"'`=]/g, c => escapeChars[c]);
};
