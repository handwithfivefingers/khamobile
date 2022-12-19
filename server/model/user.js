export default {
  username: String,
  fullName: String,
  email: String,
  phone: String,
  hash_password: String,

  delivery: {
    company: String,
    address_1: String,
    address_2: String,
    city: String,
    postCode: String,
  },
  access: {
    type: Boolean,
    default: false,
  },

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
