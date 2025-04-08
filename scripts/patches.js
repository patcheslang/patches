import antlr4 from "antlr4";
import Lexer from "../syntax/patchesLexer.js";
import Parser from "../syntax/patchesParser.js";

import Listener from "./patchesListener.js";

export default class Patches {
	constructor() {
		this.memory = new WebAssembly.Memory({ initial: 1, maximum: 1 });

		document.querySelector("form#patches").addEventListener("submit", (e) => {
			e.preventDefault();

			const code = document.querySelector("form#patches textarea").value;
			this.parse(code);
		});

		this.instantiate();
	}

	async instantiate() {
		const wasm = fetch("/scripts/patches.wasm");
		this.obj = await WebAssembly.instantiateStreaming(wasm, {
			js: { mem: this.memory },
		});

		this.bc = this.obj.instance.exports;

		this.listener = new Listener(this.bc);
	}

	parse(code) {
		const chars = new antlr4.InputStream(code);
		const lexer = new Lexer(chars);
		const tokens = new antlr4.CommonTokenStream(lexer);
		const parser = new Parser(tokens);
		const tree = parser.parse();

		console.log(tree); // TODO: DEBUG

		antlr4.tree.ParseTreeWalker.DEFAULT.walk(this.listener, tree);
	}
}

const patches = new Patches();
