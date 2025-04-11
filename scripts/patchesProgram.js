export default class PatchesProgram {
	constructor() {
		this.memory = new WebAssembly.Memory({ initial: 1, maximum: 1 });

		this.opCodes = [];
	}

	add(newCodes) {
		this.opCodes.push(...newCodes);
	}

	compile() {
		console.log("Compiling patches program...", this.opCodes);
	}

	run() {
		console.log("Running patches program...");
	}

	printMemory() {
		const mem = new BigUint64Array(this.memory.buffer);
		let str = "<tr><td>Index</td><td>Value</td><td>Hex</td></tr>\n";
		for (let i = 0; i < mem.length; i++) {
			str += "\n<tr>\n";

			str += `<td>${i}</td>`;
			str += `<td>${mem[i].toString()}</td>`;
			str += `<td>${mem[i].toString(16).padStart(16, "0")}</td>`;

			str += "\n</tr>\n";
		}

		return str;
	}
}
