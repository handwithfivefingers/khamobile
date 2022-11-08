// const { Product, Category, Career } = require('@model')
// const { errHandler, successHandler } = require('@response')
// const { default: slugify } = require('slugify')
// // Fetch data
// const { equals, default: mongoose } = require('mongoose')

// module.exports = class CategoryAdmin {
//   createCategory = async (req, res) => {
//     try {
//       let { name, parentCategory, type, price, slug } = req.body
//       let cateObj = {
//         name,
//         price,
//         slug: slugify(req.body.name),
//         type,
//         parentCategory,
//       }

//       const _cateObj = new Category(cateObj)

//       await _cateObj.save()

//       return successHandler(cateObj, res)
//     } catch (error) {
//       console.log(error)

//       return errHandler(error, res)
//     }
//   }

//   getCategory = async (req, res) => {
//     try {
//       let _cate = await Category.find({})
//       let data = await this.filterCate(_cate)

//       return successHandler(data, res)
//     } catch (error) {
//       console.log(error)
//       return errHandler(error, res)
//     }
//   }

//   updateCategory = async (req, res) => {
//     try {
//       let { _id } = req.params

//       let { name, type, price, parentCategory } = req.body

//       let _update = {
//         name,
//         type,
//         price,
//         parentCategory,
//       }

//       await Category.updateOne({ _id }, _update, { new: true })

//       return successHandler('Updated successfully', res)
//     } catch (error) {
//       console.log(error)
//       return errHandler(error, res)
//     }
//   }

//   hardDelete = async (req, res) => {
//     try {
//       let { _id } = req.params
//       await Category.findOneAndDelete({ _id })

//       return successHandler('Delete Success', res)
//     } catch (error) {
//       return errHandler(error, res)
//     }
//   }

//   softDelete = async (req, res) => {
//     try {
//       await Category.updateOne({ _id: req.body._id }, { delete_flag: 1 })
//       return successHandler('Delete Success', res)
//     } catch (error) {
//       return errHandler(error, res)
//     }
//   }

//   filterCate = async (cate) => {
//     let parent = cate.filter((item) => !item.parentCategory)

//     let child = cate.filter((item) => item.parentCategory)

//     let result = []

//     result = parent.reduce((result, current) => {
//       let item = child.filter((item) => current._id.equals(item.parentCategory))

//       if (item) {
//         let children = item.map(({ _doc }) => _doc)
//         current = {
//           ...current._doc,
//           children,
//         }
//       }

//       return [...result, current]
//     }, [])

//     return result
//   }

//   reforceCategoriesData = async (req, res) => {
//     try {
//       return res.status(200).json({})
//       await Category.deleteMany({})

//       await Category.insertMany(this.data)

//       let data = await Category.find({})

//       return res.status(200).json({ data })
//     } catch (err) {
//       console.log(err)
//       return errHandler(err, res)
//     } finally {
//     }
//   }
// }

// // backup

// // "data":

import { Category } from '#model';
import { handleDownloadFile } from '#server/middleware';
import { MESSAGE } from '#server/constant/message';
import shortid from 'shortid';
import slugify from 'slugify';
import mongoose from 'mongoose';

const equals = mongoose.equals;
class CategoryController {
	createCategory = async (req, res) => {
		try {
			let { name, description, slug, parentCategory, type } = req.body;

			let _cate = await Category.findOne({ slug });

			if (_cate) slug = slugify(name.toLowerCase() + '-' + shortid());

			let file = req.files;

			let fileLength = Object.keys(file).length;

			if (!fileLength && req.body.categoryImg && typeof req.body.categoryImg === 'string') {
				file = await handleDownloadFile(req.body.categoryImg);
				file = [file];
			} else file = file.categoryImg;

			let _created = {
				name,
				description,
				slug: slug || slugify(req.body.name),
				categoryImg: file,
				type: type || 'category',
			};
			if (parentCategory) {
				_created.parentCategory = parentCategory;
			}

			const _obj = new Category(_created);

			let data = await _obj.save();

			return res.status(200).json({
				message: MESSAGE.CREATED(),
				data,
			});
		} catch (error) {
			console.log('CategoryController createCategory', error);

			return res.status(400).json({
				message: MESSAGE.ERROR_ADMIN('danh mục'),
			});
		}
	};

	updateCategory = async (req, res) => {
		try {
			// let { name, description, slug, parentCategory } = req.body;
			let { _id } = req.params;

			let { name, description, slug, parentCategory } = req.body;

			let isFile = false;

			let file = null;

			if (req.files || typeof req.body.categoryImg === 'string') {
				isFile = true;
				file = req.files;

				let fileLength = Object.keys(file).length;

				if (!fileLength && typeof req.body.categoryImg === 'string') {
					file = await handleDownloadFile(req.body.categoryImg);
					file = [file];
				} else file = file.categoryImg;
			}

			let _updated = {
				name,
				description,
				slug: slug || slugify(req.body.name),
			};

			if (isFile) {
				_updated.categoryImg = file;
			}

			if (parentCategory) {
				_updated.parentCategory = parentCategory;
			}

			let data = await Category.updateOne({ _id }, _updated, { new: true });

			return res.status(200).json({
				message: MESSAGE.UPDATED(),
				data,
			});
		} catch (error) {
			return res.status(400).json({
				message: error?.message || MESSAGE.ERROR_ADMIN('danh mục'),
			});
		}
	};

	getSingleCategory = async (req, res) => {
		try {
			let { _id } = req.params;

			let _cate = await Category.findOne({
				_id,
			}).select('-__v -createdAt -updatedAt');

			return res.status(200).json({
				data: _cate,
				message: MESSAGE.FETCHED(),
			});
		} catch (error) {
			console.log('getSingleCategory', error);
			return res.status(400).json({
				message: MESSAGE.SYSTEM_ERROR(),
			});
		}
	};

	getCategory = async (req, res) => {
		try {
			let { type } = req.query;

			let _cate = await Category.find({
				type,
			}).select('-__v -createdAt -updatedAt');

			let _data = this.filterCate(_cate);

			return res.status(200).json({
				data: _data,
				message: MESSAGE.FETCHED(),
			});
		} catch (error) {
			console.log('getCategory', error);
			return res.status(400).json({
				message: MESSAGE.SYSTEM_ERROR(),
			});
		}
	};

	filterCate = (cateList, parentCategory = null) => {
		try {
			const categoryList = [];

			let category;

			if (parentCategory == null) {
				category = cateList.filter((cat) => cat.parentCategory == undefined);
			} else {
				category = cateList.filter((cat) => cat.parentCategory?.equals(parentCategory));
			}
			for (let cate of category) {
				categoryList.push({
					...cate._doc,
					children: this.filterCate(cateList, cate._id),
				});
			}

			return categoryList.length > 0 ? categoryList : null;
		} catch (error) {
			console.log('filterCate', error);
			throw error;
		}
	};
}

const { ...CateController } = new CategoryController();

export default CateController;
