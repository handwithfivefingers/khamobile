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
	try {
		validationResult(req).throw();
		next();
	} catch (errors) {
		console.log(req.files)
		req.files && Array.isArray(req.files) && req.files?.forEach((element) => {
			fs.unlink(element.path, (err) => {
				if (err) {
					console.log(err);
				}
				console.log(`successfully deleted ${element.path}`);
			});
		});

		res.status(400).send(errors);
	}
};

export { validateCreateCategory, isRequiresValidated };
