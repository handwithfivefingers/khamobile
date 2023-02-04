import expressValidator from 'express-validator'

const { check, validationResult } = expressValidator

const validateCreatePost = [check('title').notEmpty().withMessage('Tên bài viết không được để trống')]

const isRequiresValidated = (req, res, next) => {
  try {
    validationResult(req).throw()
    next()
  } catch (errors) {
    console.log(req.files)

    res.status(400).send({ errors, data: '???' })
  }
}

export { validateCreatePost, isRequiresValidated }
