/* eslint-env jasmine */

import * as util from "../src/util";

describe("util", () => {
  describe("trimHeadAndTail", () => {
    it("empty-spaces padding", () => {
      let strTest = " abc  ";
      let strOk = "abc";
      let result = util.trimHeadAndTail(strTest);
      expect(result).toBe(strOk);
    });

    it("\\t\\s padding", () => {
      let strTest = "\tabc  ";
      let strOk = "abc";
      let result = util.trimHeadAndTail(strTest);
      expect(result).toBe(strOk);
    });
  });

  describe("reduceSpecialChars", () => {
    it("3 spaces should be stripped to 1 space", () => {
      let strTest = "   ab   c";
      let strOk = " ab c";
      let result = util.reduceSpecialChars(strTest);
      expect(result).toBe(strOk);
    });

    it("\\t\\t should be stripped to \\t", () => {
      let strTest = "\t\tab\t\t\tc";
      let strOk = "\tab\tc";
      let result = util.reduceSpecialChars(strTest);
      expect(result).toBe(strOk);
    });
  });

  describe("stringify", () => {
    let assertToBe = (strTest, strOk) => {
      let result = util.stringify(strTest);
      expect(result).toBe(strOk);
    };

    it("string stringify", () => {
      assertToBe("abc", "\"abc\"");
    });

    it("array stringify", () => {
      assertToBe(["name", 2], "[\"name\",2]");
    });

    it("object stringify", () => {
      assertToBe({name: "jimmy", age: 13},
        "{\"name\":\"jimmy\",\"age\":13}");
    });
  });

  describe("parse", () => {
    let assertToEqual = (strTest, strOk) => {
      let result = util.parse(strTest);
      expect(result).toEqual(strOk);
    };
    it("parse object string: equal", () => {
      assertToEqual("{\"name\":\"jimmy\"}", {name: "jimmy"});
    });

    it("parse object string: same keys", () => {
      assertToEqual("{\"name\":\"jimmy\",\"age\":12}",
        {age: 12, name: "jimmy"});
    });
  });

  describe("hasOwn", () => {
    it("should has \"name\" property", () => {
      let oTest = {name: "j"};
      let result = util.hasOwn(oTest, "name");
      expect(result).toBe(true);
    });

    it("should has not", () => {
      let result;
      let oTest = {};

      // Test null
      result = util.hasOwn(oTest, null);
      expect(result).toBe(false);

      // Test undefined
      result = util.hasOwn(oTest);
      expect(result).toBe(false);

      // Test ""
      result = util.hasOwn(oTest);
      expect(result).toBe(false);
    });
  });

  describe("safeHtml", () => {
    let assert = (strTest, strOk) => {
      let result = util.safeHtml(strTest);
      expect(result).toBe(strOk);
    };

    it("should same", () => {
      assert("I am j.", "I am j.");
    });

    it("should escape html", () => {
      assert("I am \"j\".", "I am &quot;j&quot;.");
      assert("<p>I am j.</p>", "&lt;p&gt;I am j.&lt;/p&gt;");
    });
  });
});
