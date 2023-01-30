class PostModel {
	constructor(props) {
		const FIELD_ALLOW = [];
		const categoryList = ['title', 'slug', 'description', 'content', 'postImg', 'category'];

		for (let key in props) {
			if (categoryList.includes(key) && props[key] !== undefined && props[key] !== null) {
				this[key] = props[key];
			}
		}
	}
}


export default PostModel;