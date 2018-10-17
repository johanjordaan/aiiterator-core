const http = require('http')
const express = require('express')
const bodyParser = require('body-parser');

const app = express()

const router = require('./router')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', router)

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

  process.on('exit', exitHandler.bind(null,{cleanup:true}));
  process.on('SIGINT', exitHandler.bind(null,{cleanup:true}));
  process.on('SIGTERM', exitHandler.bind(null,{cleanup:true}));
  process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
  process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
  process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
}

/* istanbul ignore next */
if (require.main === module) {
  startServer()
} else {
  module.exports = {
    app
  }
}
