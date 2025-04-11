import PatchesParser from "./patchesParser.js";
import PatchesPreprocessor from "./patchesPreprocessor.js";
import PatchesProgram from "./patchesProgram.js";

export default class Patches {
	constructor() {
		document.querySelector("form#patches").addEventListener("submit", (e) => {
			e.preventDefault();

			const code = document.querySelector("form#patches textarea").value;
			this.newProgram(code);
		});
	}

	async newProgram(code) {
		this.preprocessor = new PatchesPreprocessor();

		this.parser = new PatchesParser();

		this.program = new PatchesProgram();

		fetch("/lib/patchesCore.xpl")
			.then((res) => res.text())
			.then((core) => {
				this.program.add(this.parser.parse(core));
				this.program.add(this.parser.parse(code));

				this.program.compile();
				this.program.run();

				this.printMemory(this.program.printMemory());
			});
	}

	printMemory(str) {
		document.querySelector("table#memory").innerHTML = str;
	}
}

const patches = new Patches();
