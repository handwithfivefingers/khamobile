// const fs = require('fs')
// const path = require('path')

// const ReadFile = async (req, res) => {

//   let folderName = path.resolve(path.join(global.__basedir, 'uploads'))

//   if (!fs.existsSync(folderName)) {
//     fs.mkdirSync(folderName)
//     res.status(200).json({
//       message: 'created folder',
//     })
//   } else {
//     let folder = fs.readdirSync(folderName)
//     res.status(200).json({
//       data: folder,
//     })
//   }
//   res.end()
// }

// module.exports = {
//   ReadFile,
// }
import fs from 'fs'
import path from 'path'
import Response from '#server/response'
export default class FileManagerController {
  getListfile = async (req, res) => {
    try {
      const { folder } = req.query

      let folderPath = ''

      let folderName = path.resolve(path.join(global.__basedir, 'uploads'))

      if (folder) {
        folderPath = `/${folder}`
        folderName = folderName + folderPath
      }

      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName)
        res.status(200).json({
          message: 'created folder',
        })
      } else {
        let folder = fs.readdirSync(folderName)
        const isDirectory = (item) => fs.statSync(`${folderName}\\${item}`)?.isDirectory()

        const getSrc = (item) => {
          const asPath = req.query.folder
          return isDirectory(item) ? `${asPath ? asPath + '/' : ''}` + item : `/public${folderPath}/${item}`
        }

        folder = folder
          .map((item) => ({
            name: item,
            src: getSrc(item),
            folder: isDirectory(item),
          }))
          ?.sort((a, b) => {
            if (b.folder && a.folder) return 1
            if (b.folder && !a.folder) return 1
            if (!b.folder && a.folder) return -1
            return 0
          })

        return new Response().fetched({ data: folder }, res)
      }
      return res.end()
    } catch (error) {
      console.log(error)
      return new Response().error(error, res)
    }
  }
}
