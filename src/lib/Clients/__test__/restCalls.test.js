const _ = require('lodash')
const uuidv4 = require('uuid/v4')
const should = require('should')
const nock = require('nock')

const express = require('express')
const bodyParser = require('body-parser')

const URL = 'http://testing.my.service.com/'

const app = express()
app.use(bodyParser.json())

app.get('/',(req,res)=>{
  res.json({hallo:'world'})
})

app.get('/error',(req,res)=>{
  res.status(500).json({error:'unknown db'})
})

app.post('/',(req,res)=>{
  res.json(req.body)
})

app.post('/error',(req,res)=>{
  res.status(500).json({error:'unknown db'})
})

app.put('/',(req,res)=>{
  res.json(req.body)
})

app.put('/error',(req,res)=>{
  res.status(500).json({error:'unknown db'})
})

app.delete('/',(req,res)=>{
  res.json({delete:'ok'})
})

app.delete('/error',(req,res)=>{
  res.status(500).json({error:'unknown db'})
})


const restCall = require('../restCalls')
const testRest = restCall.init('',app)
const rest = restCall.init('')

describe('GET /', () => {
  it('it should TEST_GET json', async (done) => {
    const token = ''
    const result = await testRest.GET('/',token)
    result.should.eql({hallo:'world'})
    done()

  })

  it('TEST_GET/error', async (done) => {
    try {
      const token = ''
      const result = await testRest.GET('/error',token)
      done("eeee")
    } catch(err) {
      done()
    }
  })


  it('it should GET json', async (done) => {
    nock(URL).get(uri=>true).reply(200,JSON.stringify({get:'was called'}))
    const token = ''
    const result = await rest.GET(URL,token)
    result.should.eql({get:'was called'})
    done()
  })



  it('it should convert a catch into a throw', async (done) => {
    try {
      const token = ''
      const result = await rest.GET(URL,token)
      done("eeee")
    } catch(e) {
      done()
    }
  })
})

describe('POST /', () => {
  it('it should TEST_POST json and get it back', async (done) => {
    const token = ''
    const result = await testRest.POST('/',{text:'this is some text'},token)
    result.should.eql({text:'this is some text'})
    done()
  })

  it('TEST_POST/error', async (done) => {
    try {
      const token = ''
      const result = await testRest.POST('/error',{},token)
      done("eeee")
    } catch(err) {
      done()
    }
  })



  it('it should POST json and get it back', async (done) => {
    nock(URL).post(uri=>true).reply(200,JSON.stringify({post:'was called'}))
    const token = ''
    const result = await rest.POST(URL,{text:'this is some text'},token)
    result.should.eql({post:'was called'})
    done()
  })

  it('it should convert a catch into a throw', async (done) => {
    try {
      const token = ''
      const result = await rest.POST(URL,{text:'this is some text'},token)
      done("eeee")
    } catch(e) {
      done()
    }
  })


})

describe('PUT /', () => {
  it('it should PUT_TEST json and get it back', async (done) => {
    const token = ''
    const result = await testRest.PUT('/',{text:'this is some text'},token)
    result.should.eql({text:'this is some text'})
    done()
  })

  it('TEST_PUT/error', async (done) => {
    try {
      const token = ''
      const result = await testRest.PUT('/error',{},token)
      done("eeee")
    } catch(err) {
      done()
    }
  })


  it('it should PUT_TEST json and get it back (Alias :ACTION_TEST)', async (done) => {
    const token = ''
    const result = await testRest.ACTION('/',{text:'this is some text'},token)
    result.should.eql({text:'this is some text'})
    done()
  })

  it('it should PUT json and get it back', async (done) => {
    nock(URL).put(uri=>true).reply(200,JSON.stringify({put:'was called'}))
    const token = ''
    const result = await rest.PUT(URL,{text:'this is some text'},token)
    result.should.eql({put:'was called'})
    done()
  })

  it('it should PUT json and get it back (Alias :ACTION)', async (done) => {
    nock(URL).put(uri=>true).reply(200,JSON.stringify({put:'was called'}))
    const token = ''
    const result = await rest.ACTION(URL,{text:'this is some text'},token)
    result.should.eql({put:'was called'})
    done()
  })

  it('it should convert a catch into a throw', async (done) => {
    try {
      const token = ''
      const result = await rest.PUT(URL,{text:'this is some text'},token)
      done("eeee")
    } catch(e) {
      done()
    }
  })


})

describe('DELETE /', () => {
  it('it should DELETE_TEST json and get some json back', async (done) => {
    const token = ''
    const result = await testRest.DELETE('/',token)
    result.should.eql({delete:'ok'})
    done()
  })

  it('TEST_DELETE/error', async (done) => {
    try {
      const token = ''
      const result = await testRest.DELETE('/error',token)
      done("An exception should be thrown")
    } catch(err) {
      done()
    }
  })

  it('it should DELETE json and get it back ', async (done) => {
    nock(URL).delete(uri=>true).reply(200,JSON.stringify({delete:'was called'}))
    const token = ''
    const result = await rest.DELETE(URL,{text:'this is some text'},token)
    result.should.eql({delete:'was called'})
    done()
  })

})
