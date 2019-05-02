const fs = require('fs')
const should = require('should')
const request  = require('supertest')

const Actions = require('../lib/Actions')

const config = JSON.parse(fs.readFileSync(__dirname+'/../testfixtures/gameserver.json','utf8'))
const app = require('./index').init(config)


describe("gameservers router",()=>{
  describe('GET /modules', () => {
    it('should return the list of game modules on this server', (done) => {
      request(app)
        .get('/modules')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          res.body.should.eql(['ttt','ttt2','ttt'])
          done()
        })
    })
  })

  describe('GET /:code', () => {
    it('should return info for the relevant code', (done) => {
      request(app)
        .get('/ttt')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.should.eql({
            code: 'ttt',
            name: 'Tic-Tac-Toe',
            description: 'The classic game of Tic-Tac-Toe or Naughts and Crosses',
            minPlayerCount: 2,
            maxPlayerCount: 2
          })

          done()
        })
    })

    it('should return 404 for an unknown code', (done) => {
      request(app)
        .get('/aasdadsf')
        .expect(404,done)
    })

  })

  describe('POST /:code/init', () => {
    it('should initialise a new game', (done) => {
      request(app)
        .post('/ttt/init')
        .send({config:{}})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.should.be.a.Object()
          res.body.should.have.a.property('state').which.is.a.Object()
          res.body.should.have.a.property('actions').which.is.a.Object()
          res.body.should.have.a.property('hasOpenSlots').which.is.a.Boolean()
          res.body.hasOpenSlots.should.equal(true)
          res.body.should.have.a.property('isFinished').which.is.a.Boolean()
          res.body.isFinished.should.equal(false)
          res.body.should.have.a.property('playerRankings').which.is.a.Array()
          done()
        })
    })

    it('should initialise a new game with users', (done) => {
      request(app)
        .post('/ttt/init')
        .send({config:{},playerIds:['johan','lorraine']})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.should.be.a.Object()
          res.body.should.have.a.property('state').which.is.a.Object()
          res.body.should.have.a.property('actions').which.is.a.Object()
          res.body.should.have.a.property('hasOpenSlots').which.is.a.Boolean()
          res.body.hasOpenSlots.should.equal(false)
          res.body.should.have.a.property('isFinished').which.is.a.Boolean()
          res.body.isFinished.should.equal(false)
          res.body.should.have.a.property('playerRankings').which.is.a.Array()
          done()
        })
    })

    it('should initialise a new game with an empty config', (done) => {
      request(app)
        .post('/ttt/init')
        .send({})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.should.be.a.Object()
          res.body.should.have.a.property('state').which.is.a.Object()
          res.body.should.have.a.property('actions').which.is.a.Object()
          res.body.should.have.a.property('hasOpenSlots').which.is.a.Boolean()
          res.body.hasOpenSlots.should.equal(true)
          res.body.should.have.a.property('isFinished').which.is.a.Boolean()
          res.body.isFinished.should.equal(false)
          res.body.should.have.a.property('playerRankings').which.is.a.Array()
          done()
        })
    })


    it('should return 404 for an unknown code', (done) => {
      request(app)
        .post('/asdfqwkjb2il34h/init')
        .expect(404,done)
    })
  })

  describe('POST /:code/join', () => {

    it('should let a player join', (done) => {
      request(app)
        .post('/ttt/init')
        .send({seed:123,config:{}})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const state = res.body.state
          request(app)
            .post('/ttt/join')
            .send({state,playerId:'johan'})
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              res.body.playerRankings.should.eql([['johan']])
              res.body.actions.should.have.a.property('johan').which.is.a.Object()
              res
              done()
            })
        })
    })

    it('should return a 400 when no state is passed', (done) => {
      request(app)
        .post('/ttt/init')
        .send({seed:123,config:{}})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const state = res.body.state
          request(app)
            .post('/ttt/join')
            .send({playerId:'johan'})
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              if (err) return done(err);
              res.body.message.should.equal("undefined state")
              done()
            })

        })
    })

    it('should return a 400 when no playerId is passed', (done) => {
      request(app)
        .post('/ttt/init')
        .send({seed:123,config:{}})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const state = res.body.state
          request(app)
            .post('/ttt/join')
            .send({state})
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              if (err) return done(err);
              res.body.message.should.equal("undefined playerId")
              res
              done()
            })

        })
    })


    it('should return 404 for an unknown code', (done) => {
      request(app)
        .post('/asdfqwkjb2il34h/join')
        .expect(404,done)
    })
  })


  describe('POST /:code/nextstate', () => {

    it('should get the next state based on the provided state and actions', (done) => {
      request(app)
        .post('/ttt/init')
        .send({seed:123,config:{},playerIds:['johan','lorraine']})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const state = res.body.state
          const action = Actions.ActionTools.SelectFirstActionFirstOption(res.body.actions.lorraine)
          request(app)
            .post('/ttt/nextstate')
            .send({state,actions:[{playerId:'lorraine',action}]})
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              done()
            })
        })
    })

    it('should fail with 400 if no state is provided', (done) => {
      request(app)
        .post('/ttt/init')
        .send({seed:123,config:{},playerIds:['johan','lorraine']})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const state = res.body.state
          request(app)
            .post('/ttt/nextstate')
            .send({})
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              if (err) return done(err);
              res.body.message.should.equal("undefined state")
              res
              done()
            })

        })
    })


    it('should fail with 400 if no actions is provided', (done) => {
      request(app)
        .post('/ttt/init')
        .send({seed:123,config:{},playerIds:['johan','lorraine']})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const state = res.body.state
          request(app)
            .post('/ttt/nextstate')
            .send({state})
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              if (err) return done(err);
              res.body.message.should.equal("undefined actions")
              res
              done()
            })

        })
    })


    it('should return 404 for an unknown code', (done) => {
      request(app)
        .post('/asdfqwkjb2il34h/nextstate')
        .expect(404,done)
    })
  })

})
