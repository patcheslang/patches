import Table from "./patchesTable.js";

export default class PatchesProgram {
	constructor() {
		this.memory = new WebAssembly.Memory({ initial: 1, maximum: 1, element: "i64" });
		this.formulas = new WebAssembly.Table({ element: "anyfunc", initial: 1, index: "i64" });
		this.tableDefs = new Map();
		this.prepops = [];
		this.instructions = [];

		this.doBootstrap(8n); // UINT64_ADDRESS offset

		const sum = (a, b) => a + b;

		const addWasmFunc = new WebAssembly.Function(
			{ parameters: ["i64", "i64"], results: ["i64"] },
			sum
		);

		this.formulas.set(0, addWasmFunc);
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

		let m = Number(this.tableDefs.get("__UINT64").address);
		for (const [name, table] of this.tableDefs.entries()) {
			table.address = BigInt(m);
			console.log(table.parentTable);
			table.parentTableId = this.tableDefs.get(table.parentTable).address;

			for (const field of table.fields) {
				field.typeAddress = this.tableDefs.get(field.type).address;
			}

			for (const tableMem of table.getTableMem()) {
				mem.setBigUint64(m * 8, tableMem, true); // 8 bytes = 64 bits
				m++;
			}
		}

		console.log(this.tableDefs);

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

	doBootstrap(address) {
		const __UINT64 = new Table("__UINT64");
		__UINT64.address = address;

		__UINT64.addField({
			name: "SET",
			formulaic: true,
			type: "__UINT64",
			defaultFormula: 0n,
		});

		__UINT64.addField({
			name: "GET",
			formulaic: true,
			type: "__UINT64",
			defaultFormula: 1n,
		});

		__UINT64.addField({
			name: "SORT",
			formulaic: true,
			type: "__UINT64",
			defaultFormula: 2n,
		}); // HASH

		__UINT64.addField({
			name: "HASH",
			formulaic: true,
			type: "__UINT64",
			defaultFormula: 3n,
		}); // SORT

		__UINT64.addField({
			name: "ADDRESS",
			formulaic: true,
			type: "__UINT64",
			defaultFormula: 4n,
		});

		__UINT64.addField({
			name: "CHECK",
			formulaic: true,
			type: "__UINT64",
			defaultFormula: 5n,
		});

		this.tableDefs.set("__UINT64", __UINT64);

		const __THREADS = new Table("__UINT64");

		__THREADS.addField({
			name: "index",
			primary: true,
			autoIncrement: true,
			nullable: false,
			type: "__UINT64",
		});

		__THREADS.addField({
			name: "active",
			nullable: false,
			type: "__UINT64",
		});

		__THREADS.addField({
			name: "parent",
			nullable: false,
			type: "__UINT64",
		});

		__THREADS.addField({
			name: "instruction",
			nullable: false,
			type: "__UINT64",
		});

		this.tableDefs.set("__THREADS", __THREADS);

		const __INSTANCES = new Table("__UINT64");

		__INSTANCES.addField({
			name: "index",
			primary: true,
			autoIncrement: true,
			nullable: false,
			type: "__UINT64",
		});

		__INSTANCES.addField({
			name: "active",
			nullable: false,
			type: "__UINT64",
		});

		__INSTANCES.addField({
			name: "type",
			nullable: false,
			type: "__UINT64",
		});

		__INSTANCES.addField({
			name: "thread",
			nullable: false,
			type: "__UINT64",
		});

		__INSTANCES.addField({
			name: "pointer",
			nullable: false,
			type: "__UINT64",
		});

		this.tableDefs.set("__INSTANCES", __INSTANCES);

		const __INSTRUCTIONS = new Table("__UINT64");

		__INSTRUCTIONS.addField({
			name: "index",
			primary: true,
			autoIncrement: true,
			nullable: false,
			type: "__UINT64",
		});

		__INSTRUCTIONS.addField({
			name: "funcref",
			nullable: false,
			type: "__UINT64",
		});

		__INSTRUCTIONS.addField({
			name: "batch",
			nullable: false,
			type: "__UINT64",
		});

		this.tableDefs.set("__INSTRUCTIONS", __INSTRUCTIONS);
	}
}
