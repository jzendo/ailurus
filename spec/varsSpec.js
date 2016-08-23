/* eslint-env jasmine */

import {
  PHRASE_PARSER_ENDCOMPLEXBLOCK,
  PHRASE_PARSER_SINGLEBLOCK,
  RE_PHRASE_COMPLEX_BEGIN_BLOCK,
  RE_PHRASE_COMPLEX_END_BLOCK,
  RE_PHRASE_SINGLE_BLOCK,
  RE_PHRASE_BLOCK,
  RE_SPECIALCHARS_HEADTAIL,
  RE_SPECIALCHARS_STRIP
} from "../src/vars";

describe("vars", () => {
  describe("exist", () => {
    it("should be exist.", () => {
      expect(PHRASE_PARSER_ENDCOMPLEXBLOCK).toBeDefined();
      expect(PHRASE_PARSER_SINGLEBLOCK).toBeDefined();
      expect(RE_PHRASE_COMPLEX_BEGIN_BLOCK).toBeDefined();
      expect(RE_PHRASE_COMPLEX_END_BLOCK).toBeDefined();
      expect(RE_PHRASE_SINGLE_BLOCK).toBeDefined();
      expect(RE_PHRASE_BLOCK).toBeDefined();
      expect(RE_SPECIALCHARS_HEADTAIL).toBeDefined();
      expect(RE_SPECIALCHARS_STRIP).toBeDefined();
    });
  });

  describe("valid", () => {
    it("should be valid.", () => {
      let str = "{{name}}";
      let result = RE_PHRASE_SINGLE_BLOCK.test(str);
      expect(result).toBe(true);
    });

    it("type should be string", () => {
      expect(PHRASE_PARSER_SINGLEBLOCK).toEqual(jasmine.any(String));
      expect(PHRASE_PARSER_ENDCOMPLEXBLOCK).toEqual(jasmine.any(String));
    });
  });

  describe("invalid", () => {
    it("should be invalid.", () => {
      let str = "{{123name}}";
      let result = RE_PHRASE_SINGLE_BLOCK.test(str);
      expect(result).toBe(false);
    });
  });

  describe("strip head and tail", () => {
    it("strip empty spaces", () => {
      let strTest = " abc  ";
      let strOk = "abc";
      let result = strTest.replace(RE_SPECIALCHARS_HEADTAIL, "");
      expect(result).toBe(strOk);
    });

    it("strip \\n", () => {
      let strTest = "\nabc";
      let strOk = "abc";
      let result = strTest.replace(RE_SPECIALCHARS_HEADTAIL, "");
      expect(result).toBe(strOk);
    });

    it("strip \\t", () => {
      let strTest = "\tabc";
      let strOk = "abc";
      let result = strTest.replace(RE_SPECIALCHARS_HEADTAIL, "");
      expect(result).toBe(strOk);
    });
  });
});
