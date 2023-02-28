import { Page } from '#model'
import Response from '#server/response'

export default class PageController {
  getPage = async (req, res) => {
    try {
      let { slug } = req.body
      const _page = await Page.findOne({ slug: slug })
        .populate({
          path: 'content.options.moreLink',
          select: 'name slug',
        })

        .select('-createdAt -updatedAt')

      return new Response().fetched({ data: _page }, res)
    } catch (error) {
      return new Response().error(error, res)
    }
  }
}
