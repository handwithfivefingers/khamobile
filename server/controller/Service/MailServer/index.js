import Mailjet from 'node-mailjet'
import { User } from '#model'

const APIKEY = '23f7d544800315b66201a18b3ed7e847'
const SECRETKEY = '7e2277246dc637ebc2d03ce9d0f0e60a'
export default class MailServer {
  mailjet
  constructor() {
    this.mailjet = new Mailjet({
      apiKey: APIKEY,
      apiSecret: SECRETKEY,
    })
    this.mailjet = this.mailjet.post('send', { version: 'v3.1' })
  }

  sendMail = async (req, res) => {
    try {
      let user = await User.findOne({ email: req.body.email })

      console.log('sendMail', user)

      if (!user) throw { message: 'User not found' }

      const data = {
        Messages: [
          {
            From: {
              Email: 'khamobile.vn@gmail.com',
              Name: 'Kha Mobile',
            },
            To: [
              {
                Email: req.body.email,
                Name: req.body.name,
              },
            ],
            Subject: 'TEST MAIL RECEIPT',
            TemplateID: 4412904,
            TemplateLanguage: true,
            Variables: {
              firstname: user.firstName,
              order_id: '1995',
              products: [
                {
                  name: 'san pham 1',
                  number: '1111',
                  price: '18$',
                  totalPrice: '18$',
                },
                {
                  name: 'san pham 2',
                  number: '1222',
                  price: '24$',
                  totalPrice: '24$',
                },
              ],
            },
          },
        ],
      }

      const result = await this.mailjet.request(data)

      return res.status(200).json({
        data: result.body,
      })
    } catch (error) {
      console.log('run error: ' + error)
      res.status(400).json({
        error,
      })
    }
  }

  sendMailOnly = async ({ Subject, Variables, Email, Name, TemplateID }) => {
    try {
      const data = {
        Messages: [
          {
            From: {
              Email: 'khamobile.vn@gmail.com',
              Name: 'Kha Mobile',
            },
            To: [
              {
                Email,
                Name,
              },
            ],
            Subject,
            TemplateID,
            TemplateLanguage: true,
            Variables,
          },
        ],
      }

      const result = await this.mailjet.request(data)

      return result.body
    } catch (error) {
      console.log('sendMailOnly error: ', error.response)
      throw error.response
    }
  }
}
