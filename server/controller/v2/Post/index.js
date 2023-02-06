import { Post } from '#model'
import Response from '#server/response'
import { MetadataGenerator } from 'metatags-generator'

export default class PostController {
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
        title: _post.title + ' - Khamobile',
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
}
