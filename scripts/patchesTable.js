export default class PatchesTable {
	constructor(parentTableId = 0n) {
		this.parentTableId = parentTableId;

		this.fields = [];
	}

	addField(options = {}) {
		const defaults = {
			formulaic: false,
			primary: false,
			autoIncrement: false,
			nullable: true,
			unique: false,
			protected: false,
			private: false,

			type: 8n,
			defaultFormula: 0n,
			checkFormula: 0n,
		};

		this.fields.push({ ...defaults, ...options });
	}

	getTableMem() {
		const tableDef = [];

		tableDef.push(this.parentTableId);
		tableDef.push(BigInt(this.fields.length));

		for (const field of this.fields) {
			const constraints = 128n;

			tableDef.push(constraints);

			tableDef.push(field.type);

			tableDef.push(field.defaultFormula);

			tableDef.push(field.checkFormula);
		}
		return tableDef;
	}
}
