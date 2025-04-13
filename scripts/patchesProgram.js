import Table from "./patchesTable.js";

export default class PatchesProgram {
	constructor() {
		this.memory = new WebAssembly.Memory({ initial: 1, maximum: 1 });
		this.tableDefs = new Map();
		this.prepops = [];
		this.instructions = [];

		this.doBootstrap();
	}

	doBootstrap() {
		const __UINT64 = new Table(0n);
		__UINT64.addField("SET", { formulaic: true, defaultFormula: 0n });
		__UINT64.addField("GET", { formulaic: true, defaultFormula: 1n });
		__UINT64.addField("HASH", { formulaic: true, defaultFormula: 2n });
		__UINT64.addField("SORT", { formulaic: true, defaultFormula: 3n });
		__UINT64.addField("CHECK", { formulaic: true, defaultFormula: 4n });
		__UINT64.addField("ADDRESS", { formulaic: true, defaultFormula: 5n });

		this.tableDefs.set("__UINT64", __UINT64);
	}

	add(intReps) {
		for (const [name, table] of intReps.tableDefs.entries()) {
			this.tableDefs.set(name, table);
		}

		this.prepops.push(...intReps.prepops);
		this.instructions.push(...intReps.instructions);
	}

	compile() {
		console.log("Compiling patches program...");
		const mem = new DataView(this.memory.buffer);
		let m = 8; // reserve first 8 addresses for pointers

		for (const [name, table] of this.tableDefs.entries()) {
			for (const tableMem of table.getTableMem()) {
				mem.setBigUint64(m * 8, tableMem, true);
				m++;
			}
		}

		for (const prepop of this.prepops) {
			console.log("Prepop:", prepop);
		}

		for (const instruction of this.instructions) {
			console.log("Instruction:", instruction);
		}
	}

	run() {
		console.log("Running patches program...");
	}

	getMemory() {
		return this.memory;
	}
}
