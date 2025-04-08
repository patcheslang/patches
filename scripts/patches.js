import antlr4 from "antlr4";
import Lexer from "../syntax/patchesLexer.js";
import Parser from "../syntax/patchesParser.js";

import Listener from "./patchesListener.js";

export default class Patches {
	constructor() {
		const input = "SUM(1, 2)";
		const chars = new antlr4.InputStream(input);
		const lexer = new Lexer(chars);
		const tokens = new antlr4.CommonTokenStream(lexer);
		const parser = new Parser(tokens);
		const tree = parser.parse();

		const listener = new Listener();

		antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree);
	}
}

const patches = new Patches();
