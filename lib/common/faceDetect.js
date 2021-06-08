const faceApi = require('face-api.js')

const faceDetectionNet = faceApi.nets.ssdMobilenetv1

const minConfidence = 0.5

const inputSize = 408
const scoreThreshold = 0.5

function getFaceDetectorOptions (net) {
  return net === faceApi.nets.ssdMobilenetv1
    ? new faceApi.SsdMobilenetv1Options({ minConfidence })
    : new faceApi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
}

const faceDetectionOptions = getFaceDetectorOptions(faceDetectionNet)

module.exports = {
  faceDetectionNet,
  faceDetectionOptions
}
