import { Post } from '#model'
import { handleDownloadFile } from '#server/middleware'
import Response from '#server/response'
import { MetadataGenerator } from 'metatags-generator'
import mongoose from 'mongoose'
import shortid from 'shortid'
import slugify from 'slugify'
import PostModel from './Model'

const equals = mongoose.equals

class PostController {
  createPost = async (req, res) => {
    try {
      let { title, slug, description, content, image, category } = req.body

      let _post = await Post.findOne({ slug })

      if (_post) slug = slugify(name.toLowerCase() + '-' + shortid())

      let _created = new PostModel({
        title,
        slug: slug || slugify(req.body.title.toLowerCase()),
        description,
        content,
        image,
      })

      const { ..._createObject } = new PostModel(_created)

      const _obj = new Post(_createObject)

      let data = await _obj.save()

      return new Response().created({ data }, res)
    } catch (error) {
      console.log('PostController createPost', error)

      return new Response().error(error, res)
    }
  }

  updatePost = async (req, res) => {
    try {
      let { _id } = req.params
      let _updated = {
        ...req.body,
        slug: req.body.slug || slugify(req.body.title) + shortid(),
        image: req.body.image,
      }

      const { ..._updateObject } = new PostModel(_updated)

      let data = await Post.updateOne({ _id }, _updateObject, { new: true })

      return new Response().updated({ data }, res)
    } catch (error) {
      return new Response().error(error, res)
    }
  }

  getSinglePost = async (req, res) => {
    try {
      let { _id } = req.params

      let _post = await Post.findOne({
        _id,
      }).select('-__v -createdAt -updatedAt')

      const settings = {
        structuredData: true,
        androidChromeIcons: true,
        msTags: true,
        safariTags: true,
        appleTags: true,
        openGraphTags: true,
        twitterTags: true,
        facebookTags: true,
      }

      const generator = new MetadataGenerator()

      const seoFromPost = {
        title: _post.title,
        description: _post.description,
        url: process.env.CANONICAL,
        image: `/public/${_post.postImg?.[0]?.filename}`,
        keywords: 'mobile, app mobile, kha mobile, khamobile post',
        locale: 'vi_VI',
      }
      const preparedData = generator
        .configure(settings)
        .setRobots('index, follow')
        .setProjectMeta({
          name: process.env.APP_NAME,
          url: process.env.CANONICAL,
          logo: process.env.LOGO,
          primaryColor: '#333333',
          backgroundColor: '#ffffff',
        })
        .setPageMeta(seoFromPost)
        .setCanonical(process.env.CANONICAL)
        .setFacebookMeta(5233)
        .build()

      return new Response().fetched({ data: _post, seo: [preparedData.head, preparedData.body] }, res)
    } catch (error) {
      console.log('getSinglePost', error)
      return new Response().error(error, res)
    }
  }

  getPost = async (req, res) => {
    try {
      const data = await Post.find({})

      return new Response().fetched({ data: data?.map(({ _doc }) => ({ ..._doc, dynamicRef: 'Post' })) }, res)
    } catch (error) {
      return new Response().error(error, res)
    }
  }

  filterCate = (cateList, parentCategory = null) => {
    try {
      let category

      if (parentCategory == null) {
        category = cateList.filter((cat) => cat.parentCategory == undefined)
      } else {
        category = cateList.filter((cat) => cat.parentCategory?.equals(parentCategory))
      }
      for (let cate of category) {
        categoryList.push({
          ...cate._doc,
          children: this.filterCate(cateList, cate._id),
        })
      }

      return categoryList.length > 0 ? categoryList : null
    } catch (error) {
      console.log('filterCate', error)
      throw error
    }
  }
}

const { ...PostControl } = new PostController()

export default PostControl
