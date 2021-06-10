# koa-face-detect

人脸识别服务

## api

### 图片人脸识别

```javascript
url: http://127.0.0.1:4000/faceDetection/image
method: POST
requestBody: {
  url: "https://t.com/n.jpg"
}
response: {
  code: 0,
  message: 'OK',
  data: []
}
```
