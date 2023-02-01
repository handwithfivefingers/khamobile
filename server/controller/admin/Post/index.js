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
      let { title, slug, description, content, postImg, category } = req.body

      let _post = await Post.findOne({ slug })

      if (_post) slug = slugify(name.toLowerCase() + '-' + shortid())

      let file = req.files

      let fileLength = Object.keys(file).length

      if (!fileLength && postImg && typeof postImg === 'string') {
        file = await handleDownloadFile(postImg)

        file = [{ ...file, filename: '/public/' + file.filename }]
      } else file = file.postImg

      let _created = {
        title,
        slug: slug || slugify(req.body.title.toLowerCase()),
        description,
        content,
        postImg: file || null,
        category: category || null,
      }

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

      let { title, slug, description, content, postImg, category } = req.body

      let isFile = false

      let file = null
      console.log('coming ??', req.files, typeof req.body.postImg, req.body.postImg !== 'null')

      if (req.files || typeof req.body.postImg === 'string') {
        console.log('come in ??')
        isFile = true
        file = req.files
        let fileLength = Object.keys(file).length

        if (!fileLength && typeof postImg === 'string') {
          file = await handleDownloadFile(postImg)
          file = [file]
        } else file = file.postImg
      }

      let _updated = {
        title: title ? title : null,
        description: description ? description : null,
        content: content ? content : null,
        slug: slug ? slug || slugify(req.body.name) : null,
        postImg: isFile ? file : null,
        category: category || null,
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
      let { slug } = req.params

      let _post = await Post.findOne({
        slug,
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
      console.log('get Post')

      const data = await Post.find({})

      return new Response().fetched({ data }, res)
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
