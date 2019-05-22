const _ = require('lodash')
const uuidv4 = require('uuid/v4')
const should = require('should')
const nock = require('nock')

const Actions = require('../../Actions')

const base = 'https://api.aiiterator.com'

const serverClient = require('../serverClient').init(base)

nock(base).post('/auth/register').times(100).reply(200,JSON.stringify({user:{id:'userId'}}))
nock(base).post('/auth/login').times(100).reply(200,JSON.stringify({token:'token'}))
nock(base).post('/auth/become').times(100).reply(200,JSON.stringify({token:'becomeToken'}))
nock(base).get('/auth/whoami').times(100).reply(200,JSON.stringify({loggedinuser:{id:'userId',playerId:'playerId'}}))

nock(base).get('/players/').times(100).reply(200,JSON.stringify({players:[{},{},{},{},{}]}))
nock(base).get('/players/?mine').times(100).reply(200,JSON.stringify({players:[{},{}]}))
nock(base).post('/players/').times(100).reply(200,JSON.stringify({player:{id:'playerId'}}))

nock(base).get('/matches/').times(100).reply(200,JSON.stringify({matches:[{},{}]}))
nock(base).post('/matches/').times(100).reply(200,JSON.stringify({match:{id:'newMatch'}}))
nock(base).put('/matches/someMatchId').times(100).reply(200,JSON.stringify({match:{id:'someMatchId'}}))
nock(base).get('/matches/someMatchId').times(100).reply(200,JSON.stringify({match:{id:'someMatchId'}}))


nock(base).get('/games/someGameId/gamestates/someGameStateId').times(100).reply(200,JSON.stringify({gamestate:{id:'someGameStateId'}}))
nock(base).put('/games/someGameId/gamestates/someGameStateId').times(100).reply(200,JSON.stringify({gamestate:{id:'newGameStateId'}}))

describe('serverClient',()=>{
  describe('register',()=>{
    it('should register a new user',async (done)=>{
      try {
        const user  = await serverClient.register('jdoe@gmail.com','password')
        expect(user.id).toBe('userId')
        done()
      } catch(err) {
        done(err)
      }
    })
  })

  describe('login',()=>{
    it('should log a user in when presented with correct credentials',async (done)=>{
      try {
        const token  = await serverClient.login('jdoe@gmail.com','password')
        expect(token).toBe('token')
        done()
      } catch(err) {
        done(err)
      }
    })
  })

  describe('listPlayers',()=>{
    it('should list all the players',async (done)=>{
      try {
        const token  = await serverClient.login('sandy@gmail.com','password')
        const players  = await serverClient.listPlayers(token)
        players.length.should.equal(5)
        done()
      } catch(err) {
        done(err)
      }
    })
  })

  describe('listMyPlayers',()=>{
    it('should list all logged in users players',async (done)=>{
      try {
        const token  = await serverClient.login('sandy@gmail.com','password')
        const players  = await serverClient.listMyPlayers(token)
        players.length.should.equal(2)
        done()
      } catch(err) {
        done(err)
      }
    })
  })


  describe('createPlayer',()=>{
    it('should create a new player',async (done)=>{
      try {
        const token  = await serverClient.login('sandy@gmail.com','password')
        const players = await serverClient.listPlayers(token)
        const player = await serverClient.createPlayer('player',token)
        expect(player.id).toBe('playerId')
        done()
      } catch(err) {
        done(err)
      }
    })
  })

  describe('become',()=>{
    it('should allow a loged in user to become one of their players',async (done)=>{
      try {
        const token  = await serverClient.login('sandy@gmail.com','password')
        const players = await serverClient.listPlayers(token)
        const player = await serverClient.createPlayer('player',token)
        const newToken  = await serverClient.become(player.id)
        expect(newToken).toBe('becomeToken')
        done()
      } catch(err) {
        done(err)
      }
    })
  })

  describe('whoami',()=>{
    it('should extyract the currenty logged in user/player details',async (done)=>{
      try {
        const token  = await serverClient.loginAndBecome('sandy@gmail.com','password')
        const me = await serverClient.whoami(token)
        expect(me.id).toBe('userId')
        expect(me.playerId).toBe('playerId')
        done()
      } catch(err) {
        done(err)
      }
    })
  })


  describe('loginAndBecome',()=>{
    it('should log a user in and let them become one of their players',async (done)=>{
      try {
        const token  = await serverClient.login('sandy@gmail.com','password')
        const players = await serverClient.listPlayers(token)
        const player = await serverClient.createPlayer('player',token)
        const newToken  = await serverClient.loginAndBecome('sandy@gmail.com','password', player.id)
        expect(newToken).toBe('becomeToken')
        done()
      } catch(err) {
        done(err)
      }
    })
  })


  describe('listOpenMatches',()=>{
    it('should list open matches',async (done)=>{
      try {
        const token  = await serverClient.login('sandy@gmail.com','password')
        const matches  = await serverClient.listOpenMatches(token)
        matches.length.should.equal(2)
        done()
      } catch(err) {
        done(err)
      }
    })
  })

  describe('createMatch',()=>{
    it('should create a match and return the match details',async (done)=>{
      try {
        const token  = await serverClient.loginAndBecome('sam@gmail.com','password','samPlayer')
        const gameTypeId = 'gameTypeId'
        const bestof = 3
        const poolId = 'poolId'
        const match = await serverClient.createMatch(gameTypeId, bestof, poolId, token)

        expect(match.id).toBe('newMatch')

        done()
      } catch(err) {
        done(err)
      }
    })
  })

  describe('joinMatch',()=>{
    it('should join the specified match',async (done)=>{
      try {
        const token  = await serverClient.loginAndBecome('sam@gmail.com','password','samPlayer')
        const matchId = 'someMatchId'
        const match = await serverClient.joinMatch(matchId,token)

        expect(match.id).toBe(matchId)

        done()
      } catch(err) {
        done(err)
      }
    })
  })

  describe('getMatch',()=>{
    it('should get specified matchs details',async (done)=>{
      try {
        const token  = await serverClient.loginAndBecome('sam@gmail.com','password','samPlayer')
        const matchId = 'someMatchId'
        const match = await serverClient.getMatch(matchId,token)

        expect(match.id).toBe(matchId)

        done()
      } catch(err) {
        done(err)
      }
    })
  })


  describe('getGameState',()=>{
    it('should get the specified gamestate',async (done)=>{
      try {
        const token  = await serverClient.loginAndBecome('sam@gmail.com','password','samPlayer')
        const gameId = 'someGameId'
        const gameStateId = 'someGameStateId'
        const gameState = await serverClient.getGameState(gameId,gameStateId,token)

        expect(gameState.id).toBe(gameStateId)

        done()
      } catch(err) {
        done(err)
      }
    })
  })


  describe('submitAction',()=>{
    it('should updateb teh gamestate',async (done)=>{
      try {
        const token  = await serverClient.loginAndBecome('sam@gmail.com','password','samPlayer')
        const gameId = 'someGameId'
        const gameStateId = 'someGameStateId'
        const action = {}
        const gameState = await serverClient.submitAction(gameId,gameStateId,action,token)

        expect(gameState.id).toBe('newGameStateId')

        done()
      } catch(err) {
        done(err)
      }
    })
  })

})
