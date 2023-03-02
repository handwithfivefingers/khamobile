// const { Product, Category } = require('@model')

import { generateSeoTag } from '#common/helper'
import { ProductCategory } from '#model'

export default class SeoController {
  getHomeSeo = async (req, res) => {
    try {
      const seoTags = await generateSeoTag({
        title: 'Kha Mobile - Giá tốt mỗi ngày',
        description: 'Kha Mobile - Giá tốt mỗi ngày - Chuyên kinh doanh các mặt hàng về Apple',
        url: `${process.env.CANONICAL}`,
        breadcrumb: [{ title: 'Trang chủ', url: process.env.CANONICAL }],
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
        url: `${process.env.CANONICAL}/about-us`,
        breadcrumb: [
          { title: 'Trang chủ', url: process.env.CANONICAL },
          { title: 'About us', url: process.env.CANONICAL + '/about-us' },
        ],
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
        title: `Danh mục Điện thoại mới nhất - Kha Mobile - Giá tốt mỗi ngày`,
        description: 'Danh mục Điện thoại mới nhất - Kha Mobile - Giá tốt mỗi ngày',
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
        title: `Danh sách Điện thoại mới nhất giá rẻ - Kha Mobile - Giá tốt mỗi ngày`,
        description: 'Danh sách Điện thoại mới nhất giá rẻ - Kha Mobile - Giá tốt mỗi ngày',
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

  getSingleProductCategorySeo = async (req, res) => {
    try {
      const { slug } = req.params

      let _cate = await ProductCategory.findOne({ slug: slug })

      const seoTags = await generateSeoTag({
        title: `Danh mục ${_cate?.name} mới nhất - Kha Mobile - Giá tốt mỗi ngày`,
        description: `Danh mục ${_cate?.name} mới nhất - Kha Mobile - Giá tốt mỗi ngày`,
        url: `${process.env.HOSTNAME}/category/${_cate?.slug}`,
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
