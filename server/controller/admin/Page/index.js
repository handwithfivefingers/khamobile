import { Page } from '#model'
import Response from '#server/response'
import mongoose from 'mongoose'
export default class PageController {
  getAllPages = async (req, res) => {
    try {
      const _page = await Page.find({})
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

      await Page.updateOne({ _id: _id }, formData, { new: true })

      return new Response().updated({}, res)
    } catch (error) {
      return new Response().error(error, res)
    }
  }

  getPageById = async (req, res) => {
    try {
      const { _id } = req.params
      console.log(_id)
      const _page = await Page.findOne({ _id: mongoose.Types.ObjectId(_id) })

      return new Response().fetched({ data: _page }, res)
    } catch (error) {
      console.log('getPageId error', error)
      return new Response().error(error, res)
    }
  }
}
