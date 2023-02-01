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
