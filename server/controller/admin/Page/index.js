import { Page } from '#model'
import Response from '#server/response'
import mongoose from 'mongoose'
export default class PageController {
  getAllPages = async (req, res) => {
    try {
      let _page = await Page.find({})

      _page = _page?.map(({ _doc }) => ({ ..._doc, dynamicRef: 'Page' }))

      return new Response().fetched({ data: _page }, res)
    } catch (error) {
      return new Response().error(error, res)
    }
  }

  createPage = async (req, res) => {
    try {
      //   const _page = await Page.findOne({ _id: req.body._id })

      const formData = req.body

      const _pageModel = new Page({
        ...formData,
      })

      await _pageModel.save()

      return new Response().created({}, res)
    } catch (error) {
      return new Response().error(error, res)
    }
  }

  updatePage = async (req, res) => {
    try {
      const { _id } = req.params

      const { ...formData } = req.body

      let content = formData.content

      // for (let sectionName in content) {
      //   const currentSection = content[sectionName]
      //   if (currentSection.type === 'Products') {
      //     currentSection.data = currentSection.data.map((item) => {
      //       if (typeof item === 'string') {
      //         return item
      //       }
      //       return item?._id
      //     })
      //   }
      //   if (currentSection.type === 'Category') {
      //     currentSection.data = currentSection.data.map((item) => {
      //       if (typeof item === 'string') {
      //         return item
      //       }
      //       return item?._id
      //     })
      //   }
      // }

      for (let contentSection of content) {
        if (contentSection.type === 'Product') {
          contentSection.data = contentSection.data.map((item) => {
            if (typeof item === 'string') {
              return mongoose.Types.ObjectId(item)
            }
            return mongoose.Types.ObjectId(item?._id)
          })
        } else if (contentSection.type === 'ProductCategory') {
          let { options } = contentSection
          options.moreLink = options.moreLink.map((item) => {
            if (typeof item === 'string') {
              return mongoose.Types.ObjectId(item)
            }
            return mongoose.Types.ObjectId(item?._id)
          })
        }
      }

      formData.content = content

      await Page.updateOne({ _id: _id }, formData, { new: true })

      return new Response().updated({}, res)
    } catch (error) {
      console.log('update error: ' + error)
      return new Response().error(error, res)
    }
  }

  getPageById = async (req, res) => {
    try {
      const { _id } = req.params
      console.log('get pageById: ' + _id)
      const _page = await Page.findOne({ _id: mongoose.Types.ObjectId(_id) })
        .populate({
          path: 'content.options.moreLink',
          select: 'name slug',
        })
        .populate({
          path: 'content.data',
          match: { 'content.dynamicRef': true },
        })
      return new Response().fetched({ data: _page }, res)
    } catch (error) {
      console.log('getPageId error', error)
      return new Response().error(error, res)
    }
  }
}
