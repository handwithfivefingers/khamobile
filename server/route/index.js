import express from 'express'
import { upload, userMiddleware, adminMiddleware, authenticating, cacheControl } from '#middleware'
import AdminRouter from './admin'
import WebRouter from './web'
import ServiceRouter from './service'
import sharp from 'sharp'
import path from 'path'
import moment from 'moment'
const AppRouter = express()

const UploadRouter = async (req, res, next) => {
  try {
    const [file] = req.files.upload

    const { originalname, buffer } = file

    const ref = `${moment().format('YYYYMMDDHHmm')}-${originalname}.webp`

    const filePath = path.join(global.__basedir, 'uploads', ref)

    await sharp(buffer).webp({ quality: 20 }).toFile(filePath)

    return res.status(200).json({
      url: `/public/${ref}`,
    })
  } catch (error) {
    console.log('UploadRouter', error)
    return res.status(400).json({
      error: {
        message: 'The image upload failed because the image was too big (max 2MB).',
      },
    })
  }
}

AppRouter.use('/service', ServiceRouter)

AppRouter.use(
  '/admin',
  authenticating,
  adminMiddleware,
  Object.keys(AdminRouter).map((routerName) => AdminRouter[routerName]),
),
  AppRouter.post(
    '/upload',
    authenticating,
    userMiddleware,
    upload.fields([{ name: 'upload', maxCount: 1 }]),
    UploadRouter,
  )

AppRouter.use(
  '/',
  // cacheControl,
  Object.keys(WebRouter).map((routerName) => WebRouter[routerName]),
)

export default AppRouter
