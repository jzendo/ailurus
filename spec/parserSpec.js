/* eslint-env jasmine */

import parser from "../src/parser";
import {
  PHRASE_PARSER_ENDCOMPLEXBLOCK,
  PHRASE_PARSER_SINGLEBLOCK
} from "../src/vars";

describe("parser", () => {
  describe("field expression", () => {
    it("everything is ok", () => {
      let fieldBlock = parser[PHRASE_PARSER_SINGLEBLOCK]("name");
      let result;

      result = fieldBlock.indexOf("q.push") > -1;
      expect(result).toBe(true);

      result = fieldBlock.indexOf("context[\"name\"]") > -1;
      expect(result).toBe(true);
    });
  });

  describe("end block expression", () => {
    it("everything is ok", () => {
      let endBlock = parser[PHRASE_PARSER_ENDCOMPLEXBLOCK]("each");
      let result;
      // Test each
      result = endBlock.indexOf("tmpContext") > -1;
      expect(result).toBe(true);
      result = endBlock.indexOf("tmpQ.push") > -1;
      expect(result).toBe(true);

      // Test other
      // - if
      endBlock = parser[PHRASE_PARSER_ENDCOMPLEXBLOCK]("if");
      result = endBlock === "}";
      expect(result).toBe(true);
    });
  });

  describe("each", () => {
    it("everything is ok", () => {
      let each = parser.each("name");
      let result;
      result = each.indexOf("tmpContext") > -1;
      expect(result).toBe(true);

      result = each.indexOf("<ul>") > -1;
      expect(result).toBe(true);
    });
  });

  describe("if", () => {
    it("everything is ok", () => {
      /* eslint-disable dot-notation */
      let if_ = parser["if"]("name");
      /* eslint-enable dot-notation */
      let result;
      result = if_.indexOf("context") > -1;
      expect(result).toBe(true);

      result = if_.indexOf("if") === 0;
      expect(result).toBe(true);
    });
  });
});
