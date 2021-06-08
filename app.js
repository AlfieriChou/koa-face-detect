const Koa = require('koa')
const koaBody = require('koa-body')
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
const path = require('path')

const FaceDetect = require('./lib/detect')

const app = new Koa()
const faceDetect = new FaceDetect()

app.use(koaLogger())
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, './'),
    keepExtensions: true
  }
}))
app.use(bodyParser())
app.use(async (ctx, next) => {
  try {
    if (ctx.request.path === '/upload' && ctx.request.method === 'POST') {
      const { file } = ctx.request.files
      const result = await faceDetect.run(file)
      ctx.body = result
      await next()
    } else {
      ctx.body = {
        code: 0,
        message: ''
      }
    }
  } catch (err) {
    ctx.body = {
      code: 400,
      message: err.message
    }
  }
})

app.listen(4000, () => {
  console.info('listening on 4000')
})
