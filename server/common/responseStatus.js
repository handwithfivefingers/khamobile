const Success = ({ res, message, data }) => {
  return res.status(200).json({
    message,
    data,
  })
}

const Error = ({ res, message, error }) => {
  return res.status(400).json({
    message,
    error,
  })
}

const ErrorPermission = ({ res, message, error }) => {
  return res.status(401).json({
    message,
    error,
  })
}

const ErrorNotFound = ({ res, message, error }) => {
  return res.status(404).json({
    message,
    error,
  })
}

export { Success, Error, ErrorPermission, ErrorNotFound }
