import { User } from '#model'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import Response from '#server/response'

export default class UserController {
  registerUser = async (req, res) => {
    try {
      console.log('coming registerUser ????', req)
      let _user = await User.findOne({
        $and: [{ email: req.body.email }, { delete_flag: { $ne: 1 } }],
      })

      if (_user) throw { message: 'tài khoản đã tồn tại' }

      const { username, fullName, email, phone, password } = req.body

      const hash_password = await bcrypt.hash(password, 10)

      const _obj = new User({
        username,
        fullName,
        email,
        phone,
        hash_password,
      })

      const _save = await _obj.save()

      const { email: _email, role, _id } = _save

      let _tokenObj = { _id, role }

      await this.generateToken(_tokenObj, res)


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
            fullName: _user.fullName,
            delivery: _user.delivery,
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

  Logout = async (req, res) => {
    res.clearCookie('sessionId')

    return res.status(200).json({
      authenticate: false,
    })
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

  authenticateUser = async (req, res) => {
    try {
      let userId = req.id

      const _user = await User.findOne({ _id: mongoose.Types.ObjectId(userId), delete_flag: 0 }).select(
        '-hash_password -updatedAt -createdAt -delete_flag -__v',
      )

      if (!_user) throw new Error({ message: 'User not found' })

      res.status(200).json({ authenticate: true, data: _user })
    } catch (error) {
      res.status(400).json({ authenticate: false, message: error?.message })
    }
  }

  updateDeliveryInformation = async (req, res) => {
    try {
      const { company, address_1, address_2, city, postCode } = req.body
      const id = req.id

      if (!id) throw { message: 'Unauthorized' }

      await User.updateOne(
        {
          _id: mongoose.Types.ObjectId(id),
        },
        {
          delivery: {
            company,
            address_1,
            address_2,
            city,
            postCode,
          },
        },
        {
          new: true,
        },
      )

      return res.status(200).json({
        message: 'updated delivery successfully',
      })
    } catch (error) {
      return res.status(400).json({ error, message: 'Something went wrong' })
    }
  }

  updateInformation = async (req, res) => {
    try {
      const { username, fullName, email, phone } = req.body
      const id = req.id

      if (!id) throw { message: 'Unauthorized' }

      await User.updateOne(
        {
          _id: mongoose.Types.ObjectId(id),
        },
        {
          username,
          fullName,
          email,
          phone,
        },
        {
          new: true,
        },
      )

      return res.status(200).json({
        message: 'updated Information successfully',
      })
    } catch (error) {
      return res.status(400).json({ error, message: 'Something went wrong' })
    }
  }

  updatePassword = async (req, res) => {
    try {
      const { old_password, new_password, confirm_password } = req.body

      const id = req.id

      if (!req.role || req.role === 'admin') throw { message: 'You are not allowed' }

      if (!id) throw { message: 'Unauthorized' }

      if (confirm_password !== new_password) throw { message: 'Password doesnt match' }

      const _user = await User.findOne({ _id: mongoose.Types.ObjectId(id) })

      const auth = await _user.authenticate(old_password)

      if (!auth) throw { message: 'Authentication failed' }

      const hash_password = await bcrypt.hash(password, 10)

      _user.hash_password = hash_password

      await _user.save()

      return res.status(200).json({
        message: 'updated Password successfully',
      })
    } catch (error) {
      return res.status(400).json({ error, message: 'Something went wrong' })
    }
  }
}
