const _ = require('lodash')
const {
  fromJS,
} = require('immutable')

const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory())
const servers = dirs(path.resolve(__dirname, '../games'))

const gameservers = _.fromPairs(_.map(servers,(server)=>{
  const module = require(path.resolve(__dirname, '../games',server,'server'))
  return [module.Info().code,module]
}))

const createRetVal = (module, state) => {
  const retVal = {
    state,
    actions:module.GetActions(state),
    hasOpenSlots:module.HasOpenSlots(state),
    isFinished:module.IsFinished(state),
    playerRankings:module.GetRankings(state),
  }
  return retVal
}

/// List the modules in this server
//
router.get('/', (req, res) => {
  res.json(_.keys(gameservers))
})


/// List the modules in this server
//
router.get('/:code/info', (req, res) => {
  const module = gameservers[req.params.code]
  if(module === undefined) { res.status(404).send(); return; }

  res.json(module.Info())
})

// Post the initial game config
// Returns an initial gamestate
router.post('/:code/init', (req, res) => {
  const module = gameservers[req.params.code]
  if(module === undefined) { res.status(404).send(); return; }

  const seed = req.body.seed || null
  const config = req.body.config || {}
  const playerIds = req.body.playerIds || []

  const state = _.reduce(playerIds,(currentState,playerId)=>{
    return module.Join(currentState,playerId)
  }, module.Init(seed,config))

  res.json(createRetVal(module,state))
})

// Post a game state .... as well as the user to join and initial config?
// Retryrns a new gamne state
router.post('/:code/join', (req, res) => {
  const module = gameservers[req.params.code]
  if(module === undefined) { res.status(404).send(); return; }

  const currentState = req.body.state
  if(currentState === undefined) { res.status(400).json({message:'undefined state'}); return; }

  const playerId = req.body.playerId
  if(playerId === undefined) { res.status(400).json({message:'undefined playerId'}); return; }

  const newState = module.Join(fromJS(currentState), playerId)
  res.json(createRetVal(module,newState))
})

// Post a game state and a ordered array of actions
// Returns a new game state
router.post('/:code/nextstate', (req, res) => {
  const module = gameservers[req.params.code]
  if(module === undefined) { res.status(404).send(); return; }

  const state = req.body.state
  if(state === undefined) { res.status(400).json({message:'undefined state'}); return; }

  const actions = req.body.actions
  if(actions === undefined) { res.status(400).json({message:'undefined actions'}); return; }

  const newState = _.reduce(actions,(currentState,action)=>{
    return module.GetNextState(currentState,action.playerId,action.action)
  }, fromJS(state))

  res.json(createRetVal(module,newState))
})



module.exports = router
