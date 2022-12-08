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
import { User } from '#model'
const storage = multer.diskStorage({
  limits: { fileSize: 1 * Math.pow(1024, 2 /* MBs*/) },
  fileFilter(req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true)
    } else {
      req.fileTypeInvalid = 'Invalid format, only JPG and PNG'
      cb(null, false, req.fileTypeInvalid)
    }
  },
  destination: function (req, file, cb) {
    cb(null, path.join(path.resolve(''), 'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, moment().format('YYYYMMDDHHmm') + '-' + file.originalname)
  },
})

export const upload = multer({ storage })

export const TrackingApi = async (req, res, next) => {
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
export const handleDownloadFile = async (url) => {
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

export const authenticating = async (req, res, next) => {
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

// export default {
// 	upload,
// 	TrackingApi,
// };
// const requireSignin = async (req, res, next) => {
// 	try {
// 		let token = req.cookies['sessionId'];

// 		if (!token) throw { message: 'Authorization required' };

// 		const decoded = await jwt.verify(token, process.env.SECRET);

// 		if (decoded) {
// 			let { _id, role, updatedAt } = decoded;

// 			let _user = await User.findOne({ _id });

// 			if (new Date(_user.updatedAt).getTime() !== new Date(updatedAt).getTime()) throw { message: 'Token Expired' };

// 			const newToken = jwt.sign({ _id, role, updatedAt }, process.env.SECRET, {
// 				expiresIn: process.env.EXPIRE_TIME,
// 			});

// 			req.role = decoded.role;

// 			req.id = decoded._id;

// 			var hour = 3600000;

// 			res.cookie('sessionId', newToken, {
// 				maxAge: 2 * 24 * hour,
// 				httpOnly: true,
// 			});

// 			next();
// 		}
// 	} catch (err) {
// 		// authFailedHandler(res)
// 		res.clearCookie();
// 		return authFailedHandler(res);
// 		// return errHandler(err, res)
// 	}
// };

// module.exports = {
// 	upload,
// 	requireSignin,
// 	TrackingApi,
// };
