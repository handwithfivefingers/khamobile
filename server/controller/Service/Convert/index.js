import axios from 'axios'
import SKU from '#uploads/mockup/product.json' assert { type: 'json' }

import colorAttr from '#uploads/mockup/colorAttribute' assert { type: 'json' }
import sizeAttr from '#uploads/mockup/sizeAttribute' assert { type: 'json' }
import verAttr from '#uploads/mockup/versionAttribute' assert { type: 'json' }
import { ProductAttribute, ProductAttributeTerm } from '#model'

export default class ConvertController {
  BASE_PATH = 'https://khamobile.vn/wp-json/wc/v3/products/1640/variations'
  BASE_PATH = 'https://khamobile.vn/wp-json/wc/v3/products'

  getSKU = async (req, res) => {
    try {
      let data = SKU.map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        type: item.type,
        price: item.price,
        sale_price: item.sale_price,
        categories: item.categories,
        images: item.images?.map((img) => ({ src: img.src, id: img.id, name: img.name })),
        attributes: item.attributes,
        variations: item.variations,
      }))

      return res.status(200).json({
        notVariable: data.filter((item) => item.type !== 'variable'),
        length: data.length,
        data,
      })
    } catch (error) {
      return res.status(400).json({
        error,
      })
    }
  }

  getSKUById = async (req, res) => {
    try {
      let { _id } = req.params
      console.log('getSKUById', req.params)
      const path = `https://khamobile.vn/wp-json/wc/v3/products/${_id}?consumer_key=ck_eab36e5ce45b7b93acb561d4065222dc3d52459f&consumer_secret=cs_5d558329739ab909706b216037f1a788e50a3250`

      const resp = await axios.get(path)

      return res.status(200).json({
        data: resp.data,
      })
    } catch (error) {
      return res.status(400).json({
        error,
      })
    }
  }

  getVariantOfSKU = async (req, res) => {
    try {
      let data = SKU.map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        type: item.type,
        price: item.price,
        sale_price: item.sale_price,
        categories: item.categories,
        images: item.images?.map((img) => ({ src: img.src, id: img.id, name: img.name })),
        attributes: item.attributes,
        variations: item.variations,
      }))

      let { id } = req.body

      let [_product] = data.filter((item) => item.id === id)

      if (!_product) throw { message: 'Product not found' }

      // let { variations } = _product

      // let [_var] = variations.filter((item) => item === variant)

      // if (!_var) throw { message: 'Variations not found' }

      //
      console.log(_product)

      const path = `https://khamobile.vn/wp-json/wc/v3/products/${_product.id}/variations?consumer_key=ck_eab36e5ce45b7b93acb561d4065222dc3d52459f&consumer_secret=cs_5d558329739ab909706b216037f1a788e50a3250`

      console.log(path)

      const resp = await axios.get(path)
      const skuRespon = resp.data.map((item) => ({
        id: item.id,
        price: item.price,
        regular_price: item.regular_price,
        regular_price: item.regular_price,
        image: {
          id: item.image?.id,
          src: item.image?.src,
          name: item.image?.name,
        },
        attributes: item.attributes,
      }))
      return res.status(200).json({
        data: skuRespon,
      })
    } catch (error) {
      console.log('getVariantOfSKU error', error)
      return res.status(400).json({
        error,
      })
    }
  }

  getAttribute = async (req, res) => {
    try {
      let _verAttr = await ProductAttribute.findOne({ key: 'Phiên bản' })
      let _sizeAttr = await ProductAttribute.findOne({ key: 'Dung lượng' })
      let _colorAttr = await ProductAttribute.findOne({ key: 'Màu sắc' })
      console.log(_verAttr._doc._id)

      // for (let { name } of verAttr) {
      //   let _attr = new ProductAttributeTerm({
      //     parentId: _verAttr._doc._id,
      //     name,
      //   })

      //   await _attr.save()
      // }

      // for (let { name } of sizeAttr) {
      //   let _attr = new ProductAttributeTerm({
      //     parentId: _sizeAttr._doc._id,
      //     name,
      //   })

      //   await _attr.save()
      // }
      // for (let { name } of colorAttr) {
      //   let _attr = new ProductAttributeTerm({
      //     parentId: _colorAttr._doc._id,
      //     name,
      //   })

      //   await _attr.save()
      // }

      return res.status(200).json({
        message: 'ok',
      })
    } catch (error) {
      return res.status(400).json({ error })
    }
  }
}
