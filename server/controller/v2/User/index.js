// const { User } = require('@model')
// const { successHandler, errHandler } = require('@response')
// const bcrypt = require('bcryptjs')

// module.exports = class UserClass {
//   fetchProfile = async (req, res) => {
//     try {
//       let _user = await User.findOne({ _id: req.id }).select('-hash_password')

//       return successHandler(_user, res)
//     } catch (e) {
//       console.log('fetchProfile error')
//       return errHandler(e, res)
//     }
//   }

//   changePassword = async (req, res) => {
//     try {
//       let { old_password, new_password, confirm_password } = req.body

//       if (!old_password) return errHandler('Password must be filled', res)

//       if (new_password !== confirm_password) return errHandler('confirm password doesnt match', res)

//       let _user = await User.findOne({ _id: req.id })

//       let isPassword = await _user.authenticate(old_password)

//       if (isPassword) {
//         const hash_password = await bcrypt.hash(new_password, 10)

//         await User.findOneAndUpdate({ _id: _user._id }, { hash_password }, { new: true })

//         return successHandler('Change Password success', res)
//       }

//       return errHandler('Password doesnt correct, please try again !', res)
//     } catch (err) {
//       console.log('changePassword error')
//       return errHandler(err, res)
//     }
//   }
// }
import { User } from '#model'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
export default class UserController {
  registerUser = async (req, res) => {
    try {
      console.log('coming registerUser ????', req)
      let _user = await User.findOne({
        $and: [{ email: req.body.email }, { delete_flag: { $ne: 1 } }],
      })

      if (_user) throw { message: 'tài khoản đã tồn tại' }

      const { username, firstName, lastName, email, phone, password } = req.body

      const hash_password = await bcrypt.hash(password, 10)

      const _obj = new User({
        username,
        firstName,
        lastName,
        email,
        phone,
        hash_password,
      })

      const _save = await _obj.save()

      const { email: _email, role, _id } = _save

      let _tokenObj = { _id, role }

      await this.generateToken(_tokenObj, res)

      // let mailParams = await this.getMailParams({ name, phone, password, role, email: _email }, res)

      // await sendmailWithAttachments(req, res, mailParams)

      return res.status(201).json({
        role,
        message: 'Đăng kí thành công',
      })
    } catch (err) {
      console.log('Register Error', err)
      return res.status(200).json({
        message: 'Something went wrong',
        error: err,
      })
    }
  }

  LoginUser = async (req, res) => {
    try {
      let { type } = req.body

      if (type === 'google') return this.LoginWithGoogle(req, res)

      const _user = await User.findOne({ username: req.body.username })

      if (_user) {
        const auth = await _user.authenticate(req.body.password)

        console.log(_user)
        if (auth) {
          let _tokenObj = { _id: _user._id, role: _user.role, updatedAt: _user.updatedAt }

          await this.generateToken(_tokenObj, res)

          let newData = {
            _id: _user._id,
            name: _user.name,
            email: _user.email,
            phone: _user.phone,
            role: _user.role,
          }

          return res.status(200).json({
            data: newData,
            authenticate: true,
          })
        }
      }
      throw { mesage: ' Something went wrong' }
    } catch (err) {
      console.log('LoginUser error', err)
      return res.status(400).json({
        message: 'Tài khoản hoặc mật khẩu không đúng, vui lòng thử lại',
      })
    }
  }

  LoginWithGoogle = async (req, res) => {
    try {
      let { clientId, credential, type } = req.body

      if (type !== 'google') throw 'error type Login'

      if (CLIENT_ID !== clientId) throw 'ClientID didnt match'

      const urlGG = `https://oauth2.googleapis.com/tokeninfo`

      let { data } = await axios.get(urlGG, {
        params: {
          id_token: credential,
        },
      })
      // console.log(data)
      if (!data) throw { message: 'Token invalid' }
      if (!data.email) throw { message: 'User not valid' }

      let _user = await User.findOne({
        email: data.email,
      })

      let _tokenObj

      let newData

      if (!_user) {
        // register
        let _userCreated = await this.createUserFromGoogle(data)

        _tokenObj = { _id: _userCreated._id, role: _userCreated.role, updatedAt: _userCreated.updatedAt }

        newData = {
          role: _userCreated.role,
        }
      } else {
        // console.log('have user', _user)
        if (!_user.google.sub || _user.google.sub !== data.sub) {
          _user.google = { ...data }
          await _user.save()
        }

        _tokenObj = { _id: _user._id, role: _user.role, updatedAt: _user.updatedAt }

        newData = {
          role: _user.role,
        }
      }

      await this.generateToken(_tokenObj, res)

      return res.status(200).json({
        data: newData,
        authenticate: true,
        callbackUrl: `/${newData.role}`,
      })
    } catch (error) {
      console.log(error)
      return errHandler(error, res)
    }
  }

  createUserFromGoogle = async (user) => {
    try {
      var password = Math.random().toString(36).slice(-8)
      const hash_password = await bcrypt.hash(password, 10)

      let _userObj = new User({
        phone: user.sub,
        name: user.name,
        email: user.email,
        hash_password,
        google: {
          ...user,
        },
      })

      await _userObj.save()

      return _userObj
    } catch (error) {
      throw { message: 'Create user failed', error: error }
    }
  }

  generateToken = async (obj, res) => {
    const token = await jwt.sign(obj, process.env.SECRET, {
      expiresIn: process.env.EXPIRE_TIME,
    })
    var hour = 3600000

    res.cookie('sessionId', token, {
      maxAge: 2 * 24 * hour,
      httpOnly: true,
    })
  }
}
