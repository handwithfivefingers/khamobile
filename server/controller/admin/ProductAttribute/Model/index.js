class ProductVariableModel {
	constructor(props) {
		const FIELD_ALLOW = ['key', 'value'];

		for (let key in props) {
			if (FIELD_ALLOW.includes(key) && props[key] !== undefined && props[key] !== null) {
				this[key] = props[key];
			}
		}
	}
}

export default ProductVariableModel;
