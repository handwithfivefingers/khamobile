class ProductModel {
  constructor(props) {
    const FIELD_ALLOW = [
      "title",
      "description",
      "content",
      "type",
      "slug",
      "price",
      "img",
      "category",
      "variable",
      "primary_variant",
      "primary_value",
    ];

    for (let key in props) {
      if (
        FIELD_ALLOW.includes(key) &&
        props[key] !== undefined &&
        props[key] !== null &&
        props[key].length > 0
      ) {
        this[key] = props[key];
      }
    }
  }
}

export default ProductModel;
