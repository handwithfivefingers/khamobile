import dotenv from 'dotenv'
import express from 'express'
import ConfigDatabase from './configs/db'
import { envInit } from '#server/configs/environment'
import appConfigs from '#server/configs/defaultConfig'
process.setMaxListeners(0)

dotenv.config()

const port = process.env.DEV_PORT

const app = express()

const { onInit } = new appConfigs(app)

envInit()

onInit()

app.listen(port, async (err) => {
  if (err) throw err
  await ConfigDatabase.connectDB()
  console.log(`> Ready on http://localhost:${port}`)
})
