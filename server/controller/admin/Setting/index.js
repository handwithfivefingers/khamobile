import { Setting } from '#model'
import Response from '#server/response'
import mongoose from 'mongoose'
export default class SettingController {
  createSetting = async (req, res) => {
    try {
      const formData = req.body

      const _setting = new Setting(formData)

      await _setting.save()

      return new Response().created({}, res)
    } catch (error) {
      return new Response().error(error, res)
    }
  }

  updateSetting = async (req, res) => {
    try {
      let formData = req.body
      const { _id } = req.params

      let _update = { ...formData }

      let menu = _update.menu

      // if(menu)

      //  format menu;

      // for (let i = 0; i < menu.length; i) {
      //   const menuItem = menu[i]

      //   const menuChild = []

      //   if (menuItem.children.length > 0) {
      //   }
      // }
      menu = this.onBringChildrenItemToParent(menu)

      _update.menu = menu
      // console.log(menu)

      await Setting.updateOne({ _id: mongoose.Types.ObjectId(_id) }, _update, { new: true })

      return new Response().updated({}, res)
    } catch (error) {
      console.log(error)
      return new Response().error(error, res)
    }
  }

  getSetting = async (req, res) => {
    try {
      const [_setting] = await Setting.find({}).populate({ path: 'menu._id', select: '_id title slug name' })
      console.log('setting', _setting)
      const _menu = _setting.menu

      const newMenu = this.onBringParentItemToChildren(_menu)

      return new Response().fetched({ data: { ..._setting._doc, menu: newMenu } }, res)
    } catch (error) {
      return new Response().error(error, res)
    }
  }
  /**
   *
   * @param {* Array [ { _id, children, ...} ]} data
   * @param {* String '' } _id
   * @return { * Array }
   */
  onBringChildrenItemToParent = (data, parentId = null) => {
    const result = []
    for (let child of data) {
      let childResult = []

      if (child.children?.length) {
        childResult = this.onBringChildrenItemToParent(child.children, child._id)
      }

      if (parentId) {
        child.parentId = parentId
      }

      result.push(child)

      if (childResult.length) {
        result.push(...childResult)
      }
    }

    return result
  }

  onBringParentItemToChildren = (data, parentId = null) => {
    try {
      const result = []

      let list

      if (!parentId) {
        list = data.filter((item) => !item.parentId)
      } else {
        list = data.filter((item) => JSON.stringify(item.parentId) === JSON.stringify(parentId))
      }

      // console.log('list', parentId, list)

      for (let child of list) {
        console.log('child', child._id)

        result.push({
          ...child._doc,
          name: child._id?.title || child?._id?.name || '',
          slug: child._id?.slug,
          _id: child._id?._id,
          children: this.onBringParentItemToChildren(data, child._id?._id),
        })
      }

      return result.length > 0 ? result : null
    } catch (error) {
      throw error
    }
  }
}
