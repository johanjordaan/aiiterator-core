const _ = require('lodash')
const fetch = require('node-fetch')
const request  = require('supertest')

const GET = (base,url,token) => {
  return fetch(base+url, {
    method: 'GET',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': token,
    }
  })
  .then(result => {
    if(result.status>=400) {
      return Promise.reject(result.status)
    } else {
      return result
    }
  })
  .then(result => result.json())
}

const POST = (base, url, body, token) => {
  return fetch(base+url, {
    method: 'POST',
    body:JSON.stringify(body),
    headers:{
      'Content-Type': 'application/json',
      'Authorization': token,
    }
  })
  .then(result => {
    if(result.status>=400) {
      return Promise.reject(result.status)
    } else {
      return result
    }
  })
  .then(result => result.json())
}

const PUT = (base, url, body, token) => {
  return fetch(base+url, {
    method: 'PUT',
    body:JSON.stringify(body),
    headers:{
      'Content-Type': 'application/json',
      'Authorization': token,
    }
  })
  .then(result => {
    if(result.status>=400) {
      return Promise.reject(result.status)
    } else {
      return result
    }
  })
  .then(result => result.json())
}

const DELETE = (base, url, body, token) => {
  return fetch(base+url, {
    method: 'DELETE',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': token,
    }
  })
  .then(result => {
    if(result.status>=400) {
      return Promise.reject(result.status)
    } else {
      return result
    }
  })
  .then(result => result.json())
}

const TEST_GET = (app,base,url, token) => {
  return new Promise((resolve,reject)=>{
    request(app).get(base+url).set('Authorization', token).end((err,res)=>{
      if(res.status>=400) {
        reject(res.status)
      } else {
        resolve(res.body)
      }
    })
  }).catch((err)=>{
    throw err
  })
}

const TEST_POST = (app,base,url,body,token) => {
  return new Promise((resolve,reject)=>{
    request(app).post(base+url).set('Authorization', token).send(body).end((err,res)=>{
      if(res.status>=400) {
        reject(res.status)
      } else {
        resolve(res.body)
      }
    })
  }).catch((err)=>{
    throw err
  })
}

const TEST_PUT = (app,base,url,body,token) => {
  return new Promise((resolve,reject)=>{
    request(app).put(base+url).set('Authorization', token).send(body).end((err,res)=>{
      if(res.status>=400) {
        reject(res.status)
      } else {
        resolve(res.body)
      }
    })
  }).catch((err)=>{
    throw err
  })
}

const TEST_DELETE = (app,base,url,token) => {
  return new Promise((resolve,reject)=>{
    request(app).delete(base+url).set('Authorization', token).end((err,res)=>{
      if(res.status>=400) {
        reject(res.status)
      } else {
        resolve(res.body)
      }
    })
  }).catch((err)=>{
    throw err
  })
}

const init = (app) => {
  if(app!==undefined){
    return {
      GET:_.curry(TEST_GET)(app),
      POST:_.curry(TEST_POST)(app),
      PUT:_.curry(TEST_PUT)(app),
      DELETE:_.curry(TEST_DELETE)(app),

      ACTION:_.curry(TEST_PUT)(app),
    }
  } else {
    return {
      GET:GET,
      POST:POST,
      PUT:PUT,
      DELETE:DELETE,

      ACTION:PUT,
    }
  }
}

module.exports = {
  init
}
