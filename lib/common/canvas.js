require('@tensorflow/tfjs-node')
const faceApi = require('@vladmandic/face-api')
const canvas = require('canvas')

const { Canvas, Image, ImageData } = canvas
faceApi.env.monkeyPatch({ Canvas, Image, ImageData })

module.exports = canvas
