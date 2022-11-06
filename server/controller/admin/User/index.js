// const { existHandler, successHandler, errHandler, permisHandler, deletedHandler } = require('../../../response')
// const { User } = require('../../../model')
// const _ = require('lodash')

// module.exports = class UserManageAdmin {
//   PAGE_SIZE = 10

//   constructor() {}

//   fetchUser = async (req, res) => {
//     try {
//       const { page, ...condition } = req.body

//       let current_page = (parseInt(page) - 1) * this.PAGE_SIZE

//       let _user = await User.find({ delete_flag: { $ne: 1 }, _id: { $ne: req.id } })
//         .select('-hash_password')
//         .skip(current_page)
//         .limit(this.PAGE_SIZE)
//         .sort('-createdAt')

//       let count = await User.find({ delete_flag: { $ne: 1 }, _id: { $ne: req.id } }).countDocuments()

//       return successHandler({ _user, count, current_page: page || 1 }, res)
//     } catch (e) {
//       console.log('error stack', e)
//       return errHandler(e, res)
//     }
//   }

//   deleteUser = async (req, res) => {
//     let { id } = req.params

//     try {
//       let _user = await User.findOneAndUpdate({ _id: id }, { delete_flag: 1 })

//       if (_user) return deletedHandler(_user, res)
//     } catch (err) {
//       console.log(err)
//       return errHandler(err, res)
//     }
//   }
// }

import { User } from '#model';
import { MESSAGE } from '#server/constant/message';
import bcrypt from 'bcryptjs';
class UserController {
	getUser = async (req, res) => {
		try {
			let _user = await User.find().select('-hash_password -delete_flag -role -updatedAt -createdAt -__v');

			return res.status(200).json({
				data: _user,
			});
		} catch (error) {
			console.log('getUser error', error);

			return res.status(400).json({ message: error.message || MESSAGE.SYSTEM_ERROR() });
		}
	};

	createUser = async (req, res) => {
		try {
			const { username, password, email } = req.body;

			let _existUser = await User.findOne({ email });

			if (_existUser) throw { message: MESSAGE.EXIST('email') };

			const hash_password = await bcrypt.hash(password, 10);

			let _userCreate = new User({
				username,
				hash_password,
				email,
			});

			await _userCreate.save();

			return res.status(200).json({
				message: MESSAGE.CREATED(),
			});
		} catch (error) {
			return res.status(400).json({ message: error.message || MESSAGE.ERROR_ADMIN('User') });
		}
	};
}

const { ...UserControl } = new UserController();

export default UserControl;
