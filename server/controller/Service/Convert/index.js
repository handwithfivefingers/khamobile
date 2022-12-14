import axios from 'axios'
import SKU from '#uploads/mockup/product.json' assert { type: 'json' }

import colorAttr from '#uploads/mockup/colorAttribute' assert { type: 'json' }
import sizeAttr from '#uploads/mockup/sizeAttribute' assert { type: 'json' }
import verAttr from '#uploads/mockup/versionAttribute' assert { type: 'json' }
import { ProductAttribute, ProductAttributeTerm, Category, ProductCategory, Product, ProductVariant } from '#model'
import { TYPE_VARIANT } from '#constant/type'
import mongoose, { startSession } from 'mongoose'
import { handleDownloadFile } from '#middleware'

export default class ConvertController {
  // BASE_PATH = 'https://khamobile.vn/wp-json/wc/v3/products/1640/variations'
  // BASE_PATH = 'https://khamobile.vn/wp-json/wc/v3/products'

  getSKU = async (req, res) => {
    try {
      let data = SKU.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.name,
        type: item.type,
        content: item.description,
        description: item.short_description,
        price: item.price,
        categories: item.categories,
        images: item.images?.map((img) => ({ src: img.src, id: img.id, name: img.name })),
        attributes: item.attributes,
        variations: item.variations,
      }))

      console.log('next start')

      for (let item of data) {
        let category = []
        if (item.categories) {
          for (let { name } of item.categories) {
            let categoryId = await ProductCategory.findOne({ name: name })
            category.push(categoryId._id)
          }
        }

        if (item.type === TYPE_VARIANT.SIMPLE) {
          const parentId = new mongoose.Types.ObjectId()

          let simpleProd = new Product({
            _id: parentId,
            title: item.title,
            slug: item.slug,
            description: item.description,
            content: item.content,
            category,
            type: item.type,
            price: item.price,
          })

          await simpleProd.save()

          // console.log('simpleProd', simpleProd)
        } else if (item.type === TYPE_VARIANT.VARIANT) {
          let { attributes } = item

          let objectCreated = {
            title: item.title,
            slug: item.slug,
            description: item.description,
            content: item.content,
            category,
            type: item.type,
            price: item.price,
            variations: [],
          }

          let index = attributes?.findIndex((attr) => attr.name === 'Dung lượng')

          if (index !== -1) {
            objectCreated.primary = 'Dung lượng'
          }

          let listVariants = await this.getSKUById(item.id)
          if (listVariants.length > 0) {
            for (let vars of listVariants) {
              let childOption = {}

              for (let { name, option } of vars.attributes) {
                childOption = {
                  ...childOption,
                  attributes: {
                    ...childOption.attributes,
                    [name]: option,
                  },
                }
              }

              childOption = {
                ...childOption,
                price: vars.price,
                regular_price: vars.regular_price,
              }

              objectCreated.variations.push(childOption)
            }
          }

          // console.log(objectCreated)
          // result.push(objectCreated)

          let result = await this.createVariantProduct(objectCreated)

          if (result.status) console.log(objectCreated.title + 'created OK')
          else console.log(objectCreated.title + 'error')
        }
      }
      console.log('next end')

      return res.status(200).json({
        notVariable: data.filter((item) => item.type !== 'variable'),
        length: data.length,
        data,
        // data: result,
      })
    } catch (error) {
      console.log('getSKU', error)
      return res.status(400).json({
        error,
      })
    }
  }

  getSKUById = async (id) => {
    try {
      const path = `https://khamobile.vn/wp-json/wc/v3/products/${id}/variations?consumer_key=ck_eab36e5ce45b7b93acb561d4065222dc3d52459f&consumer_secret=cs_5d558329739ab909706b216037f1a788e50a3250`

      const resp = await axios.get(path)

      return resp.data
    } catch (error) {
      throw error
    }
  }

  createVariantProduct = async (params) => {
    let session = await startSession()
    try {
      session.startTransaction()

      let { type, title, slug, description, content, primary, category, variations } = params

      const parentId = new mongoose.Types.ObjectId()

      let minPrice = variations?.reduce((prev, current) => (prev.price > +current.price ? current : prev))

      let baseProd = new Product({
        _id: parentId,
        title,
        slug,
        description,
        content,
        type,
        price: minPrice.price,
        primary,
        category,
      })

      await Product.create([baseProd], { session })

      for (let variant of variations) {
        let _variantItem = new ProductVariant({
          ...variant,
          parentId: parentId,
        })

        await _variantItem.save()
      }

      await session.commitTransaction()

      return { status: true }
    } catch (error) {
      console.log('coming createVariantProduct error ', error)

      await session.abortTransaction()

      return { status: false, error }
    } finally {
      session.endSession()
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
      console.log('come')
      // let _verAttr = await ProductAttribute.findOne({ key: 'Phiên bản' })
      // let _sizeAttr = await ProductAttribute.findOne({ key: 'Dung lượng' })
      // let _colorAttr = await ProductAttribute.findOne({ key: 'Màu sắc' })
      const data = SKU.map(({ name, slug, attributes }) => ({
        title: name,
        slug,
        attributes: attributes?.map((item) => ({
          name: item.name,
          value: item.options,
        })),
      }))

      for (let { attributes, slug, title } of data) {
        await Product.updateOne(
          { title, slug },
          {
            attributes: attributes,
          },
          {
            new: true,
          },
        )
      }
      return res.status(200).json({
        message: 'ok',
      })
    } catch (error) {
      return res.status(400).json({ error })
    }
  }

  getImageFromProduct = async (req, res) => {
    try {
      // let jsonFile = SKU
      const data = SKU.map(({ name, slug, images }) => ({ image: images?.map(({ src }) => src), title: name, slug }))

      for (let { image, slug, title } of data) {
        let listImagesPromise = image.map(async (item) => await handleDownloadFile(item))
        const result = await Promise.all(listImagesPromise)

        const imagesDownload = result.map((item) => ({ src: `/public/${item.filename}`, name: item.name }))

        await Product.updateOne(
          { title, slug },
          {
            image: imagesDownload,
          },
          {
            new: true,
          },
        )
      }
      return res.status(200).json({
        data,
        message: 'ok',
      })
    } catch (error) {
      console.log('error', error)
      return res.status(400).json({ error })
    }
  }
}
