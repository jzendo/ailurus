/* eslint-env jasmine */

import template from "../src/template";

describe("template", () => {
  describe("return function", () => {
    it("it is function", () => {
      let tpl = "<div></div>";
      let tplInstFn = template(tpl);
      let result;

      result = Object.prototype.toString.call(tplInstFn);
      expect(result).toEqual("[object Function]");
    });
  });

  describe("apply data", () => {
    it("field", () => {
      let data = {name: "J"};
      let tpl = "<div>{{name}}</div>";
      let tplInstResult = template(tpl, data);
      let result;

      result = tplInstResult === "<div>J</div>";
      expect(result).toBe(true);
    });

    it("each", () => {
      let data = {
        persons: [
          {
            name: "Lily"
          },
          {
            name: "Lucy'L"
          }
        ]
      };

      let tpl = "<div>{{#each persons}}{{name}}{{/each}}</div>";
      let tplInstResult = template(tpl, data);
      let result;

      result = tplInstResult.indexOf("<ul>") > -1 &&
          tplInstResult.indexOf("Lucy") > -1;
      expect(result).toBe(true);

      result = tplInstResult.indexOf("Lucy&#x27;L") > -1;
      expect(result).toBe(true);
    });

    it("if", () => {
      let data = {
        persons: [
          {
            name: "Lily",
            age: 30
          },
          {
            name: "Lucy'L",
            age: 20
          }
        ]
      };
      let tpl = "<div>{{#each persons}}" +
            "{{name}}" +
            "{{#if age <= 20}}" +
            "(younger)" +
            "{{/if}}" +
            "{{/each}}</div>";

      let tplInstResult = template(tpl, data);
      let result;

      result = tplInstResult.indexOf("</li>") > -1;
      expect(result).toBe(true);

      result = tplInstResult.indexOf("(younger)") > -1;
      expect(result).toBe(true);

      result = tplInstResult.indexOf("<li>Lucy&#x27;L(younger)</li>") > -1;
      expect(result).toBe(true);
    });
  });
});
