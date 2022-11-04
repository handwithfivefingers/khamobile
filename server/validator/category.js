// const { check, validationResult } = require('express-validator');

// exports.validateSignupRequest = [
// 	check('firstName').notEmpty().withMessage('First name is required'),
// 	check('lastName').notEmpty().withMessage('Last Name is required'),
// 	check('email').isEmail().withMessage('Valid Email is required'),
// 	check('password').isLength({ min: 6 }).withMessage('Passsword must be at least 6 character long'),
// ];

// exports.validateSigninRequest = [
// 	check('email').isEmail().withMessage('Valid Email is required'),
// 	check('password').isLength({ min: 6 }).withMessage('Passsword must be at least 6 character long'),
// ];

// exports.isRequiresValidated = (req, res, next) => {
// 	const errors = validationResult(req);
// 	if (errors.array().length > 0) {
// 		return res.status(400).json({ errors: errors.array()[0].msg });
// 	}
// 	next();
// };
import expressValidator from 'express-validator';
import fs from 'fs';

const { check, validationResult } = expressValidator;

const validateCreateCategory = [
	check('name').notEmpty().withMessage('Tên danh mục không được để trống'),
	// check('name').notEmpty().withMessage('Tên danh mục không hợp lệ'),
	// check('name').notEmpty().withMessage('Tên danh mục không hợp lệ'),
	// check('name').notEmpty().withMessage('Tên danh mục không hợp lệ'),
];

const isRequiresValidated = (req, res, next) => {
	// const errors = validationResult(req);
	// if (errors.array().length > 0) {
	// 	return res.status(400).json({ errors: errors.array()[0].msg });
	// }
	// console.log(req.body);
	// next();
	try {
		validationResult(req).throw();

		next();
	} catch (errors) {
		fs.unlink(req.file.path, (err) => {
			if (err) {
				// multipart / form - data;
				/* HANLDE ERROR */
				console.log(err);
			}
			console.log(`successfully deleted ${req.file.path}`);
		});

		res.status(400).send(errors);
	}
};

export { validateCreateCategory, isRequiresValidated };

// const fs = require('fs');

// const validator = (req, res, next) => {
// 	try {
// 		validationResult(req).throw();

// 		// continue to next middleware
// 		next();
// 	} catch (errors) {
// 		fs.unlink(req.file.path, (err) => {
// 			if (err) {
// 				multipart / form - data;
// 				/* HANLDE ERROR */
// 			}
// 			console.log(`successfully deleted ${req.file.path}`);
// 		});

// 		// return bad request
// 		res.status(400).send(errors);
// 	}
// };
