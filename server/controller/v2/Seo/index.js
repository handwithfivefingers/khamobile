// const { Product, Category } = require('@model')

import { generateSeoTag } from '#common/helper'

export default class SeoController {
  getHomeSeo = async (req, res) => {
    try {
      const seoTags = await generateSeoTag({
        title: 'Trang chủ Khamobile',
        description: 'Trang chủ Khamobile - Chuyên kinh doanh các mặt hàng về Apple',
        url: `${process.env.HOSTNAME}`,
      })

      return res.status(200).json({
        seo: [seoTags.head, seoTags.body],
      })
    } catch (error) {
      return res.status(400).json({
        message: 'something went wrong',
      })
    }
  }

  getAboutUsSeo = async (req, res) => {
    try {
      const seoTags = await generateSeoTag({
        title: 'Về chúng tôi - Khamobile',
        description: 'Về chúng tôi - Sứ mệnh Khamobile',
        url: `${process.env.HOSTNAME}/about-us`,
      })

      return res.status(200).json({
        seo: [seoTags.head, seoTags.body],
      })
    } catch (error) {
      return res.status(400).json({
        message: 'something went wrong',
      })
    }
  }

  getPostSeo = async (req, res) => {
    try {
      const seoTags = await generateSeoTag({
        title: 'Tin tức - Khamobile',
        description: 'Tổng hợp tin tức điện thoại - Khamobile',
        url: `${process.env.HOSTNAME}/tin-tuc`,
      })

      return res.status(200).json({
        seo: [seoTags.head, seoTags.body],
      })
    } catch (error) {
      return res.status(400).json({
        message: 'something went wrong',
      })
    }
  }
  getCategorySeo = async (req, res) => {
    try {
      const seoTags = await generateSeoTag({
        title: `Danh mục Điện thoại mới nhất - Khamobile`,
        description: 'Danh mục Điện thoại mới nhất - Khamobile',
        url: `${process.env.HOSTNAME}/category`,
      })

      return res.status(200).json({
        seo: [seoTags.head, seoTags.body],
      })
    } catch (error) {
      return res.status(400).json({
        message: 'something went wrong',
      })
    }
  }

  getProductSeo = async (req, res) => {
    try {
      const seoTags = await generateSeoTag({
        title: `Danh sách Điện thoại mới nhất giá rẻ - Khamobile`,
        description: 'Danh sách Điện thoại mới nhất giá rẻ - Khamobile',
        url: `${process.env.HOSTNAME}/product`,
      })

      return res.status(200).json({
        seo: [seoTags.head, seoTags.body],
      })
    } catch (error) {
      return res.status(400).json({
        message: 'something went wrong',
      })
    }
  }
}
