const path = require('path')
const tf = require('@tensorflow/tfjs-node')
// eslint-disable-next-line
const faceApi = require("@vladmandic/face-api/dist/face-api.node.js")

const modelPath = path.resolve(__dirname, './models')

module.exports = class Detect {
  constructor () {
    this.optionsSSDMobileNet = null
  }

  async image (file) {
    const decoded = tf.node.decodeImage(file)
    const casted = decoded.toFloat()
    const result = casted.expandDims(0)
    decoded.dispose()
    casted.dispose()
    return result
  }

  async detect (tensor) {
    return faceApi.detectAllFaces(tensor, this.optionsSSDMobileNet)
  }

  async run (file) {
    console.log('faceApi single-process test')
    await faceApi.tf.setBackend('tensorflow')
    await faceApi.tf.enableProdMode()
    await faceApi.tf.ENV.set('DEBUG', false)
    await faceApi.tf.ready()
    console.log(`Version: TensorFlow/JS ${faceApi.tf.version_core} faceApi ${faceApi.version.faceApi} Backend: ${faceApi.tf.getBackend()}`)
    console.log('Loading faceApi models')

    await faceApi.nets.ssdMobilenetv1.loadFromDisk(modelPath)
    this.optionsSSDMobileNet = new faceApi.SsdMobilenetv1Options({
      minConfidence: 0.5
    })
    const tensor = await this.image(file)
    const result = await this.detect(tensor)
    console.log('Detected faces:', result.length)

    tensor.dispose()

    return result
  }
}
