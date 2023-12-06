import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import AppRouter from '#route/index'
import env from 'dotenv'
import { TrackingApi } from '#middleware'

env.config()

const URL_PERMISSIONS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'http://10.0.14.235:3003',
  'https://khamobile.vn',
]

const corsOptions = {
  credentials: true,
  origin: URL_PERMISSIONS,
}

const __dirname = path.resolve('')

global.__basedir = __dirname

class ConfigApp {
  constructor(app) {
    this.app = app
    console.log('Routed Loaded')
  }

  onInit = () => {
    this.onLoadConfig().onLoadUploadConfigs().onLoadRouter().onHandlerError()
  }

  onLoadConfig = () => {
    // this.app.use(multiMiddleware);
    this.app.set('trust proxy', true)
    this.app.use(express.json())
    this.app.use(cookieParser())
    return this
  }

  onLoadUploadConfigs = () => {
    let publicPath = path.join(global.__basedir, 'uploads')
    console.log('publicPath', publicPath)
    this.app.use('/public', cors(corsOptions), express.static(publicPath, { etag: false }))
    return this
  }

  onLoadRouter = () => {
    this.app.use('/api', cors(corsOptions), TrackingApi, AppRouter)
    return this
  }

  onHandlerError = () => {
    this.app.use((err, req, res, next) => {
      res.status(500).send({
        error: err.stack,
        message: 'Internal Server Error',
      })
    })
    return this
  }
}

export default ConfigApp
