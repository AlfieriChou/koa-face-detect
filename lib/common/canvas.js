require('@tensorflow/tfjs-node')
const faceApi = require('face-api.js')
const canvas = require('canvas')

const { Canvas, Image, ImageData } = canvas
faceApi.env.monkeyPatch({ Canvas, Image, ImageData })

module.exports = canvas
