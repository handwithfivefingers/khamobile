import dotenv from 'dotenv'
import next from 'next'
import express from 'express'
import ConfigDatabase from './server/configs/db'
import { envInit } from '#server/configs/environment'
import appConfigs from '#server/configs/defaultConfig'
process.setMaxListeners(0)
dotenv.config()

const dev = process.env.NODE_ENV !== 'production'

const hostname = 'localhost'

const port = process.env.PORT
// when using middleware `hostname` and `port` must be provided below

const nextApp = next({ dev, hostname, port })

const handle = await nextApp.getRequestHandler()

const app = express()

const { onInit } = new appConfigs(app)

envInit()

await nextApp.prepare()

onInit(handle)

app.listen(port, async (err) => {
  if (err) throw err
  await ConfigDatabase.connectDB()

  console.log(`> Ready on http://localhost:${port}`)
})
