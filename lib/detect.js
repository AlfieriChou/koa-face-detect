require('@tensorflow/tfjs-node')
const faceApi = require('@vladmandic/face-api')
const path = require('path')
const canvas = require('canvas')

const minConfidence = 0.5
const inputSize = 408
const scoreThreshold = 0.5
const modelPath = path.resolve(__dirname, '../models')
const { Canvas, Image, ImageData } = canvas
const faceDetectionNet = faceApi.nets.ssdMobilenetv1

faceApi.env.monkeyPatch({ Canvas, Image, ImageData })

module.exports = class Detect {
  getFaceDetectorOptions (net) {
    return net === faceApi.nets.ssdMobilenetv1
      ? new faceApi.SsdMobilenetv1Options({ minConfidence })
      : new faceApi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
  }

  async run (file) {
    await faceDetectionNet.loadFromDisk(modelPath)
    const img = await canvas.loadImage(file)
    const faceDetectionOptions = this.getFaceDetectorOptions(faceDetectionNet)
    const detections = await faceApi.detectAllFaces(img, faceDetectionOptions)
    // const out = faceApi.createCanvasFromMedia(img)
    // faceApi.draw.drawDetections(out, detections)
    // saveFile('faceDetection.jpg', out.toBuffer('image/jpeg'))
    return detections
  }
}
