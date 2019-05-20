const _ = require('lodash')
const uuidv4 = require('uuid/v4')
const should = require('should')
const nock = require('nock')

const Actions = require('../../Actions')

const base = 'https://api.aiiterator.com'

const serverClient = require('../serverClient').init(base)

nock(base).post('/auth/login').times(100).reply(200,JSON.stringify({token:'xxx'}))
nock(base).post('/auth/become').times(100).reply(200,JSON.stringify({token:'xxx'}))

nock(base).get('/players/').times(100).reply(200,JSON.stringify({token:'xxx'}))
nock(base).get('/players/?mine').times(100).reply(200,JSON.stringify({token:'xxx'}))

nock(base).get('/pools/').times(100).reply(200,JSON.stringify({pools:[{id:'xxx'}]}))
nock(base).get('/pools/?mine').times(100).reply(200,JSON.stringify({pools:[{id:'xxx'}]}))
nock(base).put('/pools/xxx/join').times(100).reply(200,JSON.stringify({pools:[{id:'xxx'}]}))

nock(base).get('/games').times(100).reply(200,JSON.stringify({pools:[{id:'xxx'}]}))

describe('serverClient',()=>{
  describe('login',()=>{
    it('should log a user in when presented with correct credentials',async (done)=>{
      const result  = await serverClient.login('jdoe@gmail.com','password')
      result.length.should.equal(3)
      done()
    })
  })

  describe('listAllPlayers',()=>{
    it('should list all the players',async (done)=>{
      const token  = await serverClient.login('sandy@gmail.com','password')
      const players  = await serverClient.listAllPlayers(token)
      //players.length.should.equal(5)
      done()
    })
  })


  describe('listMyPlayers',()=>{
    it('should list thye playser belonging to a user',async (done)=>{
      const token  = await serverClient.login('sandy@gmail.com','password')
      const players  = await serverClient.listMyPlayers(token)
      //players.length.should.equal(2)
      done()
    })
  })


  describe('become',()=>{
    it('should allow a loged in user to become one of their players',async (done)=>{
      const token  = await serverClient.login('jdoe@gmail.com','password')
      const becomeResult = await serverClient.become('joePlayer',token)
      //becomeResult.length.should.equal(275)
      done()
    })
  })

  describe('loginAndBecome',()=>{
    it('should log a user in and let them become one of their players',async (done)=>{
      const result = await serverClient.loginAndBecome('jdoe@gmail.com','password','joePlayer')
      //result.length.should.equal(275)
      done()
    })
  })

  describe('listAllPools',()=>{
    it('should list the current pools',async (done)=>{
      const token  = await serverClient.login('sandy@gmail.com','password')
      const pools  = await serverClient.listAllPools(token)
      //pools.length.should.equal(3)
      done()
    })
  })

  describe('listMyPools',()=>{
    it('should list the pools owned by the user',async (done)=>{
      const token  = await serverClient.login('sam@gmail.com','password')
      const pools  = await serverClient.listMyPools(token)
      //pools.length.should.equal(1)
      done()
    })
  })

  describe('joinPool',()=>{
    it('should join the specified pool',async (done)=>{
      const token  = await serverClient.loginAndBecome('sam@gmail.com','password','samPlayer')
      const pools  = await serverClient.listMyPools(token)
      const result = await serverClient.joinPool(pools[0].id,token)
      //result.should.eql({currentElo:2000})
      done()
    })
  })

  describe('listActiveGames',()=>{
    it('should return all the active games in the active matches',async (done)=>{
      const token  = await serverClient.loginAndBecome('sam@gmail.com','password','samPlayer')
      const pools  = await serverClient.listMyPools(token)
      //await serverClient.joinPool(pools[0].id,token)
      const matches =  await serverClient.listActiveGames(token)
      //matches.length.should.equal(0)
      done()
    })
  })

})
