import Table from "./patchesTable.js";

export default class PatchesProgram {
	constructor() {
		this.memory = new WebAssembly.Memory({ initial: 1, maximum: 1 });
		this.tableDefs = new Map();
		this.prepops = [];
		this.instructions = [];

		this.UINT64_ADDRESS = 8n;

		this.doBootstrap();
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

		let m = Number(this.UINT64_ADDRESS); // make room for instructions pointers
		for (const [name, table] of this.tableDefs.entries()) {
			table.address = m;
			for (const tableMem of table.getTableMem()) {
				mem.setBigUint64(m * 8, tableMem, true); // 8 bytes = 64 bits
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

	doBootstrap() {
		const __UINT64 = new Table(0n);
		__UINT64.addField({
			formulaic: true,
			type: this.UINT64_ADDRESS,
			defaultFormula: 0n, // SET
		});

		__UINT64.addField({
			formulaic: true,
			type: this.UINT64_ADDRESS,
			defaultFormula: 1n, // GET
		});

		__UINT64.addField({
			formulaic: true,
			type: this.UINT64_ADDRESS,
			defaultFormula: 2n, // SORT
		}); // HASH

		__UINT64.addField({
			formulaic: true,
			type: this.UINT64_ADDRESS,
			defaultFormula: 3n, // HASH
		}); // SORT

		__UINT64.addField({
			formulaic: true,
			type: this.UINT64_ADDRESS,
			defaultFormula: 4n, // ADDRESS
		});

		__UINT64.addField({
			formulaic: true,
			type: this.UINT64_ADDRESS,
			defaultFormula: 5n, // CHECK
		});

		this.tableDefs.set("__UINT64", __UINT64);

		const __STRING = new Table(this.UINT64_ADDRESS);

		__STRING.addField({
			primary: true,
			autoIncrement: true,
			nullable: false,
			type: this.UINT64_ADDRESS,
		});

		__STRING.addField({
			type: this.UINT64_ADDRESS,
		});

		this.tableDefs.set("__STRING", __STRING);
	}
}
