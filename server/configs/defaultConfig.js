import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
// import WebRouter from '#route/web';

// import AdminRouter from '#route/admin';
import AppRouter from '#route/index'

import env from 'dotenv'
import { TrackingApi } from '#middleware'

// import multiparty from 'connect-multiparty';

// const multiMiddleware = multiparty();

env.config()

const { NODE_ENV } = process.env

const URL_PERMISSIONS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'http://10.0.14.235:3003',
  'https://khamobile.truyenmai.com',
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
    this.app.use(express.json())
    this.app.use(cookieParser())
    return this
  }

  onLoadUploadConfigs = () => {
    this.app.use('/public', cors(corsOptions), express.static(path.join(global.__basedir, 'uploads')))
    return this
  }

  onLoadRouter = () => {
    // console.log('WebRouter', handler)

    this.app.use('/api', cors(corsOptions), TrackingApi, AppRouter)

    // this.app.get('/a', (req, res) => this.app.render(req, res, '/a', req.query))

    // this.app.all('*', (req, res) => handler(req, res))

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
