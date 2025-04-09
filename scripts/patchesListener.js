import PatchesParserListener from "../syntax/patchesParserListener.js";

export default class PatchesListener extends PatchesParserListener {
	constructor() {
		super();

		this.opcodes = [];
	}

	getOpcodes() {
		return this.opcodes;
	}

	enterParse(ctx) {
		document.ctx = ctx; // TODO: DEBUG

		for (const patch of ctx.patchDef()) this.doPatchDef(patch);

		for (const formulaic of ctx.freeFormulaic()) {
			this.doFreeFormulaic(formulaic.formulaicPiped());
		}
	}

	doPatchDef(patch) {
		console.log("TODO: Implement doPatchDef", patch);
	}

	doFreeFormulaic(formulaic) {
		this.doPipedFormulaic(formulaic);
	}

	doPipedFormulaic(formulaic) {
		this.doFormulaic(formulaic.formulaic());

		if (formulaic.piped()) {
			this.doPipedFormulaic(formulaic.piped().formulaicPiped());
		}
	}

	doFormulaic(formulaic) {
		if (formulaic.field()) this.doField(formulaic.field());
		else if (formulaic.table()) this.doTable(formulaic.table());
		else if (formulaic.number()) this.doNumber(formulaic.number());
		else if (formulaic.message()) this.doMessage(formulaic.message());
		else if (formulaic.input()) this.doInput(formulaic.input());
		else if (formulaic.model()) this.doModel(formulaic.model());
		else if (formulaic.matched()) this.doMatched(formulaic.matched());
		else if (formulaic.caught()) this.doCaught(formulaic.caught());
		else if (formulaic.placeholder()) {
			this.doPlaceholder(formulaic.placeholder());
		} else if (formulaic.nulll()) this.doNulll(formulaic.nulll());
		else if (formulaic.formulaCall()) {
			this.doFormulaCall(formulaic.formulaCall());
		} else if (formulaic.exceptional()) {
			this.doExceptional(formulaic.exceptional());
		}
	}

	doField(field) {
		console.log(field.getText());
	}

	doTable(table) {
		console.log(table.getText());
	}

	doNumber(number) {
		console.log(number.getText());
	}

	doMessage(message) {
		console.log(message.getText());
	}

	doInput(input) {
		console.log(input.getText());
	}

	doModel(model) {
		console.log(model.getText());
	}

	doMatched(matched) {
		console.log(matched.getText());
	}

	doCaught(caught) {
		console.log(caught.getText());
	}

	doPlaceholder(placeholder) {
		console.log(placeholder.getText());
	}

	doNulll(nulll) {
		console.log(nulll.getText());
	}

	doFormulaCall(formulaCall) {
		console.log(formulaCall.getText());
	}

	doExceptional(exceptional) {
		console.log(exceptional.getText());
	}
}
