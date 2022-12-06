import nodemailer from 'nodemailer'

export default class MailServer {
  transporter
  constructor() {
    this.transporter = nodemailer.createTransport({
      // config mail server
      service: 'Gmail',
      auth: {
        user: 'handgod1995@gmail.com',
        pass: 'Hdme1995',
      },
    })
  }

  run = async (req, res) => {
    try {
      var mainOptions = {
        from: 'Thanh Batmon',
        to: 'handgod1995@gmail.com',
        subject: 'Test Nodemailer',
        text: 'You recieved message from ' + req.body.email,
        html:
          '<p>You have got a new message</b><ul><li>Username:' +
          req.body.name +
          '</li><li>Email:' +
          req.body.email +
          '</li><li>Username:' +
          req.body.message +
          '</li></ul>',
      }

      this.transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
          console.log(err)
          res.status(400).json({
            error: err,
          })
        } else {
          console.log('Message sent: ' + info.response)
          res.sendStatus(200)
        }
      })
    } catch (error) {
      console.log('run error: ' + error)
    }
  }
}
