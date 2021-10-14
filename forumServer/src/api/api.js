let api = ""
if (process.env.NODE_ENV === "development") {
  api = 'http://127.0.0.1:3000/'
} else {
  api = 'http://8.129.208.48:3000/'
}
module.exports = {
  api
}
