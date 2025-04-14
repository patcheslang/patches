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

			type: 0n,
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
			let constraints = 0n;

			if (field.formulaic) constraints |= 0b00000001n;
			if (field.primary) constraints |= 0b00000010n;
			if (field.autoIncrement) constraints |= 0b00000100n;
			if (field.nullable) constraints |= 0b00001000n;
			if (field.unique) constraints |= 0b00010000n;
			if (field.protected) constraints |= 0b00100000n;
			if (field.private) constraints |= 0b01000000n;

			tableDef.push(constraints);

			tableDef.push(field.type);

			tableDef.push(field.defaultFormula);

			tableDef.push(field.checkFormula);
		}
		return tableDef;
	}
}
