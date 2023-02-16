const hours = 3600

const day = 24 * hours

const month = 30 * day

export default {
  ip: {
    type: String,
  },
  data: {
    type: Object,
  },
  time: { type: Date, default: Date.now(), index: { expires: month * 2 } },
}
