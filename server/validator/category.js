import expressValidator from 'express-validator'
import fs from 'fs'

const { check, validationResult } = expressValidator

const validateCreateCategory = [check('name').notEmpty().withMessage('Tên danh mục không được để trống')]

const isRequiresValidated = (req, res, next) => {
  try {
    validationResult(req).throw()
    next()
  } catch (errors) {
    res.status(400).send(errors)
  }
}

export { validateCreateCategory, isRequiresValidated }
