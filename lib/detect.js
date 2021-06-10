require('@tensorflow/tfjs-backend-wasm')
// eslint-disable-next-line
const faceApi = require('@vladmandic/face-api/dist/face-api.node-cpu.js')
const path = require('path')
const canvas = require('canvas')

const modelPath = path.resolve(__dirname, '../models')
const minConfidence = 0.15
const maxResults = 5
let optionsSSDMobileNet

faceApi.env.monkeyPatch({ Canvas: canvas.Canvas, Image: canvas.Image, ImageData: canvas.ImageData })

module.exports = class Detect {
  constructor (logger) {
    this.logger = logger || console
  }

  async drawImage (input) {
    const img = await canvas.loadImage(input)
    const c = canvas.createCanvas(img.width, img.height)
    const ctx = c.getContext('2d')
    ctx.drawImage(img, 0, 0, img.width, img.height)
    return c
  }

  async detect (tensor) {
    return faceApi
      .detectAllFaces(tensor, optionsSSDMobileNet)
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptors()
      .withAgeAndGender()
  }

  print (face) {
    const expression = Object.entries(face.expressions).reduce((acc, val) => ((val[1] > acc[1]) ? val : acc), ['', 0])
    const box = [
      // eslint-disable-next-line no-underscore-dangle
      face.alignedRect._box._x,
      // eslint-disable-next-line no-underscore-dangle
      face.alignedRect._box._y,
      // eslint-disable-next-line no-underscore-dangle
      face.alignedRect._box._width,
      // eslint-disable-next-line no-underscore-dangle
      face.alignedRect._box._height
    ]
    const gender = `Gender: ${Math.round(100 * face.genderProbability)}% ${face.gender}`
    // eslint-disable-next-line no-underscore-dangle
    this.logger.info(`Detection confidence: ${Math.round(100 * face.detection._score)}% ${gender} 
      Age: ${Math.round(10 * face.age) / 10} 
      Expression: ${Math.round(100 * expression[1])}% ${expression[0]}  
      Box: ${box.map(a => Math.round(a))}
    `)
  }

  async run (file) {
    this.logger.info('FaceAPI single-process test')

    await faceApi.tf.setBackend('wasm')
    await faceApi.tf.enableProdMode()
    await faceApi.tf.ENV.set('DEBUG', false)
    await faceApi.tf.ready()

    // eslint-disable-next-line no-underscore-dangle
    this.logger.info(`
      Version: TensorFlow/JS ${faceApi.tf.version_core} 
      FaceAPI ${faceApi.version.faceapi} 
      Backend: ${faceApi.tf.getBackend()}
    `)

    this.logger.info('Loading FaceAPI models')
    await faceApi.nets.ssdMobilenetv1.loadFromDisk(modelPath)
    await faceApi.nets.ageGenderNet.loadFromDisk(modelPath)
    await faceApi.nets.faceLandmark68Net.loadFromDisk(modelPath)
    await faceApi.nets.faceRecognitionNet.loadFromDisk(modelPath)
    await faceApi.nets.faceExpressionNet.loadFromDisk(modelPath)
    optionsSSDMobileNet = new faceApi.SsdMobilenetv1Options({ minConfidence, maxResults })

    const c = await this.drawImage(file)
    const result = await this.detect(c)
    this.logger.info(`
      Image: ${file},
      Detected faces: ${result.length}`)
    result.reduce(async (promise, face) => {
      await promise
      this.print(face)
    }, Promise.resolve())
    return result
  }
}
