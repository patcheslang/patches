import antlr4 from "antlr4";
import Lexer from "../syntax/patchesLexer.js";
import Parser from "../syntax/patchesParser.js";

import PatchesListener from "./patchesListener.js";

export default class PatchesParser {
	parse(input) {
		const listener = new PatchesListener();
		const chars = new antlr4.InputStream(input);
		const lexer = new Lexer(chars);
		const tokens = new antlr4.CommonTokenStream(lexer);
		const parser = new Parser(tokens);
		parser.buildParseTree = true;

		const tree = parser.parse();

		antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree);

		return listener.getOpcodes();
	}
}
