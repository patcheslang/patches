import PatchesParserListener from "../syntax/patchesParserListener.js";

export default class PatchesListener extends PatchesParserListener {
	constructor(bc) {
		super();

		this.bc = bc;
	}

	enterFormulaCall(ctx) {
		document.ctx = ctx; // TODO: DEBUG

		const formulaName = ctx.formulaName().field().name().getText();

		if (formulaName.substring(0, 1) === "_") {
			const args = ctx.formulaCallItem().map((item) => item.getText());

			console.log(this.bc[formulaName](...args));
		}
	}
}
