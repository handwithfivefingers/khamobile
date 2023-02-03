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

      console.log(formData)

      let _update = { ...formData }

      let menu = _update.menu

      // if(menu)

      //  format menu;

      for (let i = 0; i < menu.length; i) {
        const menuItem = menu[i]

        const menuChild = []

        if (menuItem.children.length > 0) {
        }
      }

      await Setting.updateOne({ _id: mongoose.Types.ObjectId(_id) }, formData, { new: true })

      return new Response().updated({}, res)
    } catch (error) {
      console.log(error)
      return new Response().error(error, res)
    }
  }

  getSetting = async (req, res) => {
    try {
      const [_setting] = await Setting.find({}).populate({ path: 'menu._id', select: '_id title slug' })
      console.log(_setting)

      return new Response().fetched({ data: _setting }, res)
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
  onBringChildrenItemToParent = (data, _id) => {
    const result = []

    for (let child of data) {
      if (child.children.length) {
        let newResult = []
        newResult = onBringChildrenItemToParent(child.children, _id)
        result = [...result, newResult]
      } else {
        result.push(child)
      }
    }

    return result
  }
}
