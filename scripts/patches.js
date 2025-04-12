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

				this.printMemory(this.program.getMemory());
			});
	}

	printMemory(memory) {
		const mem = new BigUint64Array(memory.buffer);

		let str = "<tr><td>Index</td><td>Value</td><td>Hex</td></tr>\n";

		for (let i = 0; i < mem.length; i++) {
			str += "\n<tr>\n";

			str += `<td>${i}</td>`;
			str += `<td>${mem[i].toString()}</td>`;
			str += `<td>${mem[i].toString(16).padStart(16, "0")}</td>`;

			str += "\n</tr>\n";
		}


		document.querySelector("table#memory").innerHTML = str;
	}
}

const patches = new Patches();
