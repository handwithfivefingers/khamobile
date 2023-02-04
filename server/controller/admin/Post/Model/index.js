class PostModel {
  constructor(props) {
    const FIELD_ALLOW = ['title', 'slug', 'description', 'content', 'image', 'category']

    for (let key in props) {
      if (FIELD_ALLOW.includes(key) && props[key] !== undefined && props[key] !== null) {
        this[key] = props[key]
      }
    }
  }
}

export default PostModel
