const faceApi = require('@vladmandic/face-api')
const path = require('path')

const canvas = require('./common/canvas')
// const saveFile = require('./common/saveFile')
const { faceDetectionNet, faceDetectionOptions } = require('./common/faceDetect')

const modelPath = path.resolve(__dirname, './models')

module.exports = class Detect {
  async run (file) {
    await faceDetectionNet.loadFromDisk(modelPath)
    const img = await canvas.loadImage(file)
    const detections = await faceApi.detectAllFaces(img, faceDetectionOptions)
    // const out = faceApi.createCanvasFromMedia(img)
    // faceApi.draw.drawDetections(out, detections)
    // saveFile('faceDetection.jpg', out.toBuffer('image/jpeg'))
    return detections
  }
}
