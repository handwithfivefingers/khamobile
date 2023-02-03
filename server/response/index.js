import { MESSAGE } from '#server/constant/message'

export default class Response {
  fetched = (data, res, outside = false) => {
    if (outside) {
      return res.status(200).json(data)
    }
    return res.status(200).json({
      ...data,
      message: MESSAGE.FETCHED(),
    })
  }

  error = (error, res) => {
    return res.status(400).json({
      message: MESSAGE.ERROR(),
      error: error,
    })
  }

  notFound = (error, res) => {
    return res.status(400).json({
      error: error,
      message: MESSAGE.RESULT_NOT_FOUND(),
    })
  }

  created = (data, res) => {
    return res.status(200).json({
      ...data,
      message: MESSAGE.CREATED(),
    })
  }

  updated = (data, res) => {
    return res.status(200).json({
      ...data,
      message: MESSAGE.UPDATED(),
    })
  }
  deleted = (data, res) => {
    return res.status(200).json({
      ...data,
      message: MESSAGE.DELETED(),
    })
  }
}
