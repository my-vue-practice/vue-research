# vue 源码研究

1. 模板编译
2. 虚拟 dom
3. diff 算法
4. 数据响应式
5. 组件处理

需要弄懂的问题：

1. vue 文件如何变成 render 函数的（模板编译 AST）？
2. render 函数（虚拟 DOM）是怎么生成的？
3. 虚拟 DOM 是如何比较的（diff 算法）？
4. 数据更新之后是如何通知 render 更新界面的（数据响应式）？
5. 组件是如何处理、如何更新的？

了解到的基础技术：

- 模板编译里面：正则表达式、柯里化（函数式编程）、AST
- diff 算法：树算法、性能优化
- 响应式：原生 js API（defineProperty、Proxy 等）、设计模式：观察者模式（发布-订阅？）

## 模板编译

编译流程：compile -> baseCompile -> parse -> parseHTML

> baseCompile 调用 parse （parse 调用 parseHTML 解析模板字符串为 AST 返回），调用 generate （将 ast 转化成 render、staticRenderFns 返回）

- parseComponent：用于编译 vue 组件（.vue 文件），编译成一个 js 对象。
- compile：用于编译模板，将其编译成 AST（包含动态、静态属性的处理）、render 字符串、staticRenderFns 等
- compileToFunctions：用于返回 render 函数

compile 和 compileToFunctions 两个方法的不同之处有以下几点。

1. compile 返回的结果中 render 是字符串，staticRenderFns 是字符串组成的数组，而 compileToFunctions 中把它们变成了函数。
2. compile 返回的结果中，有模板生成的 ast 和搜集到的错误。而 compileToFunctions 对其结果（错误、警告等）进行了一些处理。对 compile 的 render 字符串用 new Function(render 字符串) 处理成函数了。

```ts
// parseComponent
export function parseComponent(
  file: string,
  options?: SFCParserOptions
): SFCDescriptor;
export interface SFCDescriptor {
  template: SFCBlock | undefined;
  script: SFCBlock | undefined;
  styles: SFCBlock[];
  customBlocks: SFCBlock[];
}
export interface SFCBlock {
  type: string;
  content: string;
  attrs: Record<string, string>;
  start?: number;
  end?: number;
  lang?: string;
  src?: string;
  scoped?: boolean;
  module?: string | boolean;
}

// compile
// {
//   ast: ?ASTElement, // parsed template elements to AST
//   render: string, // main render function code
//   staticRenderFns: Array<string>, // render code for static sub trees, if any
//   errors: Array<string> // template syntax errors, if any
// }
export function compile(
  template: string,
  options?: CompilerOptions
): CompiledResult<string>;
interface CompiledResult<ErrorType> {
  ast: ASTElement | undefined;
  render: string;
  staticRenderFns: string[];
  errors: ErrorType[];
  tips: ErrorType[];
}
export interface ASTElement {
  type: 1;
  tag: string;
  attrsList: { name: string; value: any }[];
  attrsMap: Record<string, any>;
  parent: ASTElement | undefined;
  children: ASTNode[];

  processed?: true;

  static?: boolean;
  staticRoot?: boolean;
  staticInFor?: boolean;
  staticProcessed?: boolean;
  hasBindings?: boolean;

  text?: string;
  attrs?: { name: string; value: any }[];
  props?: { name: string; value: string }[];
  plain?: boolean;
  pre?: true;
  ns?: string;

  component?: string;
  inlineTemplate?: true;
  transitionMode?: string | null;
  slotName?: string;
  slotTarget?: string;
  slotScope?: string;
  scopedSlots?: Record<string, ASTElement>;

  ref?: string;
  refInFor?: boolean;

  if?: string;
  ifProcessed?: boolean;
  elseif?: string;
  else?: true;
  ifConditions?: ASTIfCondition[];

  for?: string;
  forProcessed?: boolean;
  key?: string;
  alias?: string;
  iterator1?: string;
  iterator2?: string;

  staticClass?: string;
  classBinding?: string;
  staticStyle?: string;
  styleBinding?: string;
  events?: ASTElementHandlers;
  nativeEvents?: ASTElementHandlers;

  transition?: string | true;
  transitionOnAppear?: boolean;

  model?: {
    value: string;
    callback: string;
    expression: string;
  };

  directives?: ASTDirective[];

  forbidden?: true;
  once?: true;
  onceProcessed?: boolean;
  wrapData?: (code: string) => string;
  wrapListeners?: (code: string) => string;

  // 2.4 ssr optimization
  ssrOptimizability?: SSROptimizability;

  // weex specific
  appendAsTree?: boolean;
}

// compileToFunctions
// {
//   render: Function,
//   staticRenderFns: Array<Function>
// }
export function compileToFunctions(template: string): CompiledResultFunctions;
interface CompiledResultFunctions {
  render: () => VNode;
  staticRenderFns: (() => VNode)[];
}
```
