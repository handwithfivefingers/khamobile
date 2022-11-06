// const jwt = require('jsonwebtoken');
// const shortid = require('shortid');
// const path = require('path');
// const multer = require('multer');
// const { authFailedHandler, errHandler } = require('@response');
// const { User } = require('../model');

import jwt from 'jsonwebtoken';
import shortid from 'shortid';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import axios from 'axios';
import moment from 'moment';
import http from 'http';
const storage = multer.diskStorage({
	limits: { fileSize: 1 * Math.pow(1024, 2 /* MBs*/) },
	fileFilter(req, file, cb) {
		if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
			cb(null, true);
		} else {
			req.fileTypeInvalid = 'Invalid format, only JPG and PNG';
			cb(null, false, req.fileTypeInvalid);
		}
	},
	destination: function (req, file, cb) {
		cb(null, path.join(path.resolve(''), 'uploads'));
	},
	filename: function (req, file, cb) {
		cb(null, shortid.generate() + '-' + file.originalname);
	},
});

export const upload = multer({ storage });

export const TrackingApi = async (req, res, next) => {
	try {
		// console.log(req)
		let host = req.headers['host'];
		let remoteAddress = req.socket['remoteAddress'];
		// let originalUrl = req.socket['originalUrl']
		console.log(host, req.originalUrl, remoteAddress);
	} catch (err) {
	} finally {
		next();
	}
};

export const handleDownloadFile = async (url) => {
	try {
		const name = url.split('/')?.reverse()?.[0];

		if (!name) throw new Error({ message: 'URL invalid' });

		const fileName = moment().format('YYYYMMDDHHmm') + '-' + name;

		const filePath = path.join(path.resolve(''), 'uploads', fileName);

		const { data } = await axios.get(url, { responseType: 'stream' });

		data.pipe(fs.createWriteStream(filePath));

		return { filename: fileName };
		
	} catch (error) {
		throw error;
	}
};
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
