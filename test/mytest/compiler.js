// const compiler = require("vue-template-compiler");
const compiler = require("./vtc/build");

// const fs = require("fs");
// const { promisify } = require("util");
// const readFile = promisify(fs.readFile);
// const path = require("path");

const tpl = `
<div id="app">
  <h3>vue模板编译分析</h3>
  <!-- 了解编译过程 -->
  <p>{{msg}}</p>
  <p v-if="shown">我显示了吗？</p>
  <p>{{msg === '你好' ? 'Hello' : 'Front-End Brother'}}</p>
</div>
`;

const cpl = compiler.compile(tpl);
/*
{
  ast: ?ASTElement, // parsed template elements to AST
  render: string, // main render function code
  staticRenderFns: Array<string>, // render code for static sub trees, if any
  errors: Array<string> // template syntax errors, if any
}
*/

// ast: ./ast.json
// render:
// with (this) {
//   return _c("div", { attrs: { id: "app" } }, [
//     _c("h3", [_v("vue模板编译分析")]),
//     _v(" "),
//     _c("p", [_v(_s(msg))]),
//     _v(" "),
//     shown ? _c("p", [_v("我显示了吗？")]) : _e(),
//     _v(" "),
//     _c("p", [_v(_s(msg === "你好" ? "Hello" : "Front-End Brother"))]),
//   ]);
// }
// src/core/instance/render.js
// vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
// src/core/instance/render-helpers/index.js
// _v: createTextVNode
// _e: createEmptyVNode
// _s: toString

// staticRenderFns: []
// errors: []

console.log(cpl);

// readFile(path.resolve(__dirname, "./compiler.vue"), "utf8")
//   .then((data) => {
//     const content = data.toString("utf8");
//     console.log(content);
//     const cplComp = compiler.parseComponent(content);
//     console.log(cplComp);
//   })
//   .catch((err) => {
//     console.log("[err]>>", err);
//     throw err;
//   });

// let a = {
//   script: {
//     type: "script",
//     content:
//       '\nexport default {\n  data() {\n    return {\n      msg: "Vue",\n    };\n  },\n};\n',
//     start: 77,
//     attrs: {},
//     end: 152,
//   },
//   styles: [
//     {
//       type: "style",
//       content: "\n#container {\n  color: red;\n}\n",
//       start: 189,
//       attrs: {
//         lang: "scss",
//         scoped: true,
//       },
//       lang: "scss",
//       scoped: true,
//       end: 219,
//     },
//   ],
//   template: {
//     type: "template",
//     content: '\n<div id="container">Hello {{ msg }}.</div>\n',
//     start: 10,
//     attrs: {},
//     end: 56,
//   },
//   customBlocks: [],
//   errors: [],
//   data:
//     '<template>\n  <div id="container">Hello {{ msg }}.</div>\n</template>\n\n<script>\nexport default {\n  data() {\n    return {\n      msg: "Vue",\n    };\n  },\n};\n</script>\n\n<style lang="scss" scoped>\n#container {\n  color: red;\n}\n</style>\n',
// };
