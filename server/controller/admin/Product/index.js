// const { Product, Category } = require('@model')
// const { successHandler, errHandler } = require('@response')
// const slugify = require('slugify')
import { Product } from '#server/model';
import { MESSAGE } from '#server/constant/message';
import slugify from 'slugify';

export default class ProductController {
	getProducts = async (req, res) => {
		try {
			let _product = await Product.find({});

			return res.status(200).json({
				message: MESSAGE.FETCHED(),
				data: _product,
			});
		} catch (error) {
			console.log(error);

			return res.status(400).json({
				message: MESSAGE.ERROR_ADMIN('Sản phẩm'),
			});
		}
	};

	createProduct = async (req, res) => {
		try {
			const obj = {
				name: req.body.name.toString(),
				price: Number(req.body.price),
				slug: slugify(req.body.name),
				categories: req.body.categories,
				type: req.body.type,
			};

			let product = await Product.findOne({
				name: req.body.name,
			});

			if (product) throw { message: 'Product already exists' };

			const _product = new Product(obj);

			await _product.save();

			return res.status(200).json({
				message: MESSAGE.CREATED(),
				data: _var,
			});
		} catch (err) {
			console.log('createProduct error', err);

			return res.status(400).json({
				message: MESSAGE.ERROR_ADMIN('Sản phẩm'),
			});
		}
	};

	// getProducts = async (req, res) => {
	//   try {

	//     let _product = await Product.find({}).populate('categories')

	//     return successHandler(_product, res)

	//   } catch (error) {
	//     console.log(error)
	//     return errHandler(error, res)
	//   }
	// }

	// getSingleProduct = async (req, res) => {
	//   try {
	//   } catch (error) {}
	// }

	// updateProduct = async (req, res) => {
	//   try {
	//     let { _id } = req.params

	//     let { categories, name, price, type } = req.body

	//     // if (!categories) throw { message: 'No categories provided' }

	//     let _update = {
	//       name,
	//       price,
	//       type,
	//       categories,
	//     }

	//     await Product.updateOne({ _id }, _update, { new: true })

	//     return res.status(200).json({
	//       message: ' ok',
	//     })
	//   } catch (error) {
	//     console.log(error)
	//     return errHandler(error, res)
	//   }
	// }

	// deleteProduct = async (req, res) => {
	//   try {
	//     const { _id } = req.params

	//     // return;
	//     await Product.findOneAndDelete({
	//       _id,
	//     })

	//     return res.status(200).json({ message: 'Xóa sản phẩm thành công', status: 200 })
	//   } catch (err) {
	//     console.log('deleteProduct error')

	//     return errHandler(err, res)
	//   }
	// }

	// filterProductCate = (cate) => {
	//   let res = []

	//   res = cate.reduce((result, current) => {
	//     let [parent, child] = current

	//     if (child) {
	//       let index = result.findIndex((item) => item._id === parent)

	//       if (index !== -1) {
	//         result[index].child = [...result[index].child, { _id: child }]
	//       } else {
	//         result = [...result, { _id: parent, child: [{ _id: child }] }]
	//       }
	//     } else {
	//       result = [...result, { _id: parent }]
	//     }

	//     return [...result]
	//   }, [])

	//   return res
	// }
}
