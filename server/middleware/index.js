// const jwt = require('jsonwebtoken');
// const shortid = require('shortid');
// const path = require('path');
// const multer = require('multer');
// const { authFailedHandler, errHandler } = require('@response');
// const { User } = require('../model');

import jwt from 'jsonwebtoken'
import shortid from 'shortid'
import path from 'path'
import multer from 'multer'
import fs from 'fs'
import axios from 'axios'
import moment from 'moment'
import { User, Log } from '#model'
import { VNPAY_WHITELIST } from '#constant/vnpay'

// const storage = multer.diskStorage({
//   limits: { fileSize: 1 * Math.pow(1024, 2 /* MBs*/) },
//   fileFilter(req, file, cb) {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//       cb(null, true)
//     } else {
//       req.fileTypeInvalid = 'Invalid format, only JPG and PNG'
//       cb(null, false, req.fileTypeInvalid)
//     }
//   },
//   destination: function (req, file, cb) {
//     cb(null, path.join(path.resolve(''), 'uploads'))
//   },
//   filename: function (req, file, cb) {
//     cb(null, moment().format('YYYYMMDDHHmm') + '-' + file.originalname)
//   },
// })

const storage = multer.memoryStorage()

const upload = multer({ storage })

const TrackingApi = async (req, res, next) => {
  try {
    let host = req.headers['host']
    let remoteAddress = req.socket['remoteAddress']
    console.log(host, req.originalUrl, remoteAddress)
  } catch (err) {
  } finally {
    next()
  }
}

/**
 *
 * @param { string } url
 * @returns { object } { filename, name }
 */

const handleDownloadFile = async (url) => {
  try {
    console.log(url)

    const file = url.substring(url.lastIndexOf('/') + 1)

    const [name, fileType] = file.split('.')

    if (!name) throw new Error({ message: 'URL invalid' })

    const fileNameGenerate = moment().format('YYYYMMDDHHmmss') + '-' + name + '.' + fileType

    const filePath = path.join(path.resolve(''), 'uploads', fileNameGenerate)

    // if (url.includes(`${process.env.API}/public`)) return { filename: name, name }

    const { data } = await axios.get(url, { responseType: 'stream' })

    data.pipe(fs.createWriteStream(filePath))

    return { filename: fileNameGenerate, name }
  } catch (error) {
    throw error
  }
}

const authenticating = async (req, res, next) => {
  try {
    let token = req.cookies['sessionId']

    if (!token) throw { message: 'Authorization required' }

    const decoded = await jwt.verify(token, process.env.SECRET)

    if (decoded) {
      let { _id, role, updatedAt } = decoded

      let _user = await User.findOne({ _id })

      if (new Date(_user.updatedAt).getTime() !== new Date(updatedAt).getTime()) throw { message: 'Token Expired' }

      const newToken = jwt.sign({ _id, role, updatedAt }, process.env.SECRET, {
        expiresIn: process.env.EXPIRE_TIME,
      })

      req.role = decoded.role

      req.id = decoded._id

      console.log('authenticating', decoded.role, decoded._id)

      var hour = 3600000

      res.cookie('sessionId', newToken, {
        maxAge: 2 * 24 * hour,
        httpOnly: true,
      })
      next()
    }
  } catch (err) {
    res.clearCookie()
    return res.status(401).json({
      message: 'Permission Denied',
      error: err,
    })
  }
}

const userMiddleware = async (req, res, next) => {
  try {
    if (!req.id || !req.role) throw { message: 'Authorization required' }

    if (req.role === 'user' || req.role === 'admin') next()
    else throw { message: 'Permission Denied' }
  } catch (error) {
    return res.status(401).json({
      message: 'Permission Denied',
      error: error,
    })
  }
}

const adminMiddleware = async (req, res, next) => {
  try {
    console.log(req.role, req.id)
    if (req.role === 'admin') next()
    // if (!req.id || !req.role) throw { message: 'Authorization required' }
    else throw { message: 'Permission Denied' }
  } catch (error) {
    return res.status(401).json({
      message: 'Permission Denied',
      error: error,
    })
  }
}

const cacheControl = async (req, res, next) => {
  res.set('Cache-control', 'public, max-age=300')
  next()
}

const validateIPNVnpay = async (req, res, next) => {
  try {
    let WHITE_LIST = VNPAY_WHITELIST // Put your IP whitelist in this array

    if (process.env.NODE_ENV === 'development') {
      WHITE_LIST = [...WHITE_LIST, '127.0.0.1']
    }

    let remoteAddress =
      req.headers['x-forwarded-for'] ||
      req.id ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress

    let _logObject = {
      ip: remoteAddress,
      data: {
        ...req.query,
      },
    }

    if (WHITE_LIST.includes(remoteAddress)) {
      let _log = new Log(_logObject)
      await _log.save()
      next()
    } else {
      console.log('Bad IP: ' + remoteAddress)
      throw new Error('You are not allowed to access')
    }
  } catch (error) {
    return res.status(403).json({ ...error })
  }
}

export {
  upload,
  TrackingApi,
  handleDownloadFile,
  authenticating,
  userMiddleware,
  adminMiddleware,
  cacheControl,
  validateIPNVnpay,
}
