const Koa = require('koa')
const koaBody = require('koa-body')
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger')

const FaceDetect = require('./lib/detect')

const app = new Koa()
const faceDetect = new FaceDetect()

app.use(koaLogger())
app.use(koaBody({}))
app.use(bodyParser())
app.use(async (ctx, next) => {
  try {
    if (ctx.request.path === '/run' && ctx.request.method === 'POST') {
      const { url } = ctx.request.body
      const ret = await faceDetect.run(url)
      ctx.body = ret
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
      message: err.message,
      stack: err.stack
    }
  }
})

app.listen(4000, () => {
  console.info('listening on 4000')
})
