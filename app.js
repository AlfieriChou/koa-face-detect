const Koa = require('koa')
const koaBody = require('koa-body')
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
const serve = require('koa-static')
const path = require('path')

const app = new Koa()

app.use(koaLogger())
app.use(koaBody({}))
app.use(bodyParser())
app.use(serve(path.resolve(__dirname, './public')))

app.listen(4000, () => {
  console.info('listening on 4000')
})
