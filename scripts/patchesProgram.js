export default class PatchesProgram {
	constructor() {
		this.memory = new WebAssembly.Memory({ initial: 1, maximum: 1 });
		this.tableDefs = [];
		this.precomps = [];
		this.instructions = [];
	}

	add(intReps) {
		this.tableDefs.push(...intReps.tableDefs);
		this.precomps.push(...intReps.precomps);
		this.instructions.push(...intReps.instructions);
	}

	compile() {
		console.log("Compiling patches program...", this.precomps);
	}

	run() {
		console.log("Running patches program...");
	}

	getMemory() {
		return this.memory;
	}
}
