export default {
  username: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  hash_password: String,

  role: {
    type: String,
    enum: ['user', 'admin', 'anonymous'],
    default: 'anonymous',
  },

  delete_flag: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },

  google: {
    sub: String,
    hd: String,
    email: String,
    email_verified: String,
    name: String,
    picture: String,
    given_name: String,
    family_name: String,
  },
}
