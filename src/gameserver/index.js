const http = require('http')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const init = (config) => {
  const router = require('./router').init(config)

  app.use('/', router)

  return app
}

/* istanbul ignore next */
const startServer = () => {
  const server = http.createServer(app);
  server.listen(6661, () => console.log('[6661]'))

  server.on('close',()=>{
    console.log("Closing ....")
  })

  const exitHandler = (options, exitCode) => {
    console.log("Closing ....")
    server.close()
  }

  process.on('exit', exitHandler.bind(null,{cleanup:true}))
  process.on('SIGINT', exitHandler.bind(null,{cleanup:true}))
  process.on('SIGTERM', exitHandler.bind(null,{cleanup:true}))
  process.on('uncaughtException', exitHandler.bind(null, {exit:true}))
  process.on('SIGUSR1', exitHandler.bind(null, {exit:true}))
  process.on('SIGUSR2', exitHandler.bind(null, {exit:true}))
}

/* istanbul ignore next */
if (require.main === module) {
  let config = { paths: []}
  try {
    config = JSON.parse(fs.readFileSync(process.argv[2],'utf8'))
  } catch(err) {
  }
  startServer(init(config))
} else {
  module.exports = { init }
}
