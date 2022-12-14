import express from 'express'
import { upload, userMiddleware, adminMiddleware, authenticating } from '#middleware'
import AdminRouter from './admin'
import WebRouter from './web'
import ServiceRouter from './service'

const AppRouter = express()

const UploadRouter = (req, res, next) => {
  try {
    console.log('req.files', req.files)
    return res.status(200).json({
      url: `/public/${req.files.upload[0].filename}`,
    })
  } catch (error) {
    console.log('UploadRouter', error)
    return res.status(400).json({
      error: {
        message: 'The image upload failed because the image was too big (max 1.5MB).',
      },
    })
  }
}

AppRouter.use('/service', ServiceRouter)

AppRouter.use(
  '/admin',
  authenticating,
  adminMiddleware,
  AdminRouter.UserRouter,
  AdminRouter.CateRouter,
  AdminRouter.PostRouter,
  AdminRouter.ProductAttributeRoute,
  AdminRouter.ProductRouter,
  AdminRouter.OrderRouter,
)
AppRouter.post(
  '/upload',
  authenticating,
  userMiddleware,
  upload.fields([{ name: 'upload', maxCount: 1 }]),
  UploadRouter,
)

AppRouter.use(
  '/',
  WebRouter.productRouter,
  WebRouter.productCategoryRouter,
  WebRouter.orderRouter,
  WebRouter.userRouter,
  WebRouter.seoRouter,
  WebRouter.provinceRouter,
)

export default AppRouter
