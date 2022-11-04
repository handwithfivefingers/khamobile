import express from 'express';

import { upload } from '#middleware';

const router = express.Router();
// Router Upload
// router.post('/test', upload.array('teaser'), (req, res) => {
// 	res.status(200).json({
// 		img: req.files.map((file) => file.filename),
// 	});
// });

export default router;
