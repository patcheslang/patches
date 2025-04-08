import PatchesParserListener from "../syntax/patchesParserListener.js";

export default class PatchesListener extends PatchesParserListener {
	constructor() {
		super();
	}

	enterParse(ctx) {
		console.log("Entering parse");
	}
}
