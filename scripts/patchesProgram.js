import Table from "./patchesTable.js";

export default class PatchesProgram {
	constructor() {
		this.memory = new WebAssembly.Memory({ initial: 1, maximum: 1 });
		this.tableDefs = new Map();
		this.prepops = [];
		this.instructions = [];

		this.doBootstrap(8n); // UINT64_ADDRESS offset
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
			formulaic: true,
			type: "__UINT64",
			defaultFormula: 0n, // SET
		});

		__UINT64.addField({
			formulaic: true,
			type: "__UINT64",
			defaultFormula: 1n, // GET
		});

		__UINT64.addField({
			formulaic: true,
			type: "__UINT64",
			defaultFormula: 2n, // SORT
		}); // HASH

		__UINT64.addField({
			formulaic: true,
			type: "__UINT64",
			defaultFormula: 3n, // HASH
		}); // SORT

		__UINT64.addField({
			formulaic: true,
			type: "__UINT64",
			defaultFormula: 4n, // ADDRESS
		});

		__UINT64.addField({
			formulaic: true,
			type: "__UINT64",
			defaultFormula: 5n, // CHECK
		});

		this.tableDefs.set("__UINT64", __UINT64);

		const __STRING = new Table("__UINT64");

		__STRING.addField({
			primary: true,
			autoIncrement: true,
			nullable: false,
			type: "__UINT64",
		});

		__STRING.addField({
			type: "__UINT64",
		});

		this.tableDefs.set("__STRING", __STRING);
	}
}
