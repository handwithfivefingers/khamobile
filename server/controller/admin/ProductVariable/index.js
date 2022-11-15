// const { Product, Category, Career, CareerCategory } = require('@model');
// const { errHandler, successHandler } = require('@response');
// const { default: slugify } = require('slugify');
// // Fetch data
// const { equals, default: mongoose } = require('mongoose');
// const { ProductVariable } = require('#server/model');
// const { MESSAGE } = require('#server/constant/message');

import { ProductVariable } from '#server/model';
import { MESSAGE } from '#server/constant/message';
import ProductVariableModel from './Model';

export default class ProductVariableController {
	createVariable = async (req, res) => {
		try {
			const _existsVar = await ProductVariable.findOne({ key: req.body.key });

			if (_existsVar) {
				req.params._id = _existsVar._doc._id;
				return this.updateVariable(req, res);
			}

			const _variable = {
				key: req.body.key,
				value: req.body.value,
			};

			const _var = new ProductVariable(_variable);

			await _var.save();

			return res.status(200).json({
				message: MESSAGE.CREATED(),
				data: _var,
			});
		} catch (error) {
			console.log('createVariable error: ' + error);

			return res.status(400).json({
				message: MESSAGE.ERROR_ADMIN('Biến thể sản phẩm'),
			});
		}
	};

	updateVariable = async (req, res) => {
		try {
			const { _id } = req.params;

			if (req.body.type === 'add') {
				// Add
				_updated = {
					$push: {
						value: [req.body.value],
					},
				};
			} else if (req.body.type === 'remove') {
				// Remove
				_updated = {
					$pull: { value: { $in: [req.body.value] } },
				};
			}
			const _var = await ProductVariable.findOne({ _id });

			console.log(_var, req.body);

			await ProductVariable.updateOne({ _id: _id }, _updated, { new: true });

			return res.status(200).json({
				message: MESSAGE.UPDATED(),
			});
		} catch (error) {
			console.log('createVariable error: ' + error);

			return res.status(400).json({
				message: MESSAGE.ERROR_ADMIN('Biến thể sản phẩm'),
			});
		}
	};

	getVariable = async (req, res) => {
		try {
			const _var = await ProductVariable.find({ delete: 0 });

			return res.status(200).json({
				message: MESSAGE.FETCHED(),
				data: _var,
			});
		} catch (error) {
			console.log('getVariable error: ' + error);
			return res.status(400).json({
				message: MESSAGE.ERROR_ADMIN('Biến thể sản phẩm'),
			});
		}
	};
}
