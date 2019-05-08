const _ = require('lodash')
const {
  fromJS,
} = require('immutable')

const express = require('express')
const fs = require('fs')
const path = require('path')

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

const init = (config) => {
  const router = express.Router()

  const modules = _.map(config.modules,(module)=>{
    const moduleCode = require(path.resolve(module.path))
    //console.log(`Loaded [${moduleCode.Info().name}]`)

    const codePrefix = module.code===""?"/":"/"+(module.code||moduleCode.Info().code)

    router.get(`${codePrefix}`, (req, res) => {
      res.json(moduleCode.Info())
    })

    // Post the initial game config
    // Returns an initial gamestate
    router.post(`${codePrefix}/init`, (req, res) => {
      const seed = req.body.seed || null
      const config = req.body.config || {}
      const playerIds = req.body.playerIds || []

      const state = _.reduce(playerIds,(currentState,playerId)=>{
        return moduleCode.Join(currentState,playerId)
      }, moduleCode.Init(seed,config))

      res.json(createRetVal(moduleCode,state))
    })

    // Post a game state .... as well as the user to join and initial config?
    // Retryrns a new gamne state
    router.post(`${codePrefix}/join`, (req, res) => {
      const currentState = req.body.state
      if(currentState === undefined) { res.status(400).json({message:'undefined state'}); return; }

      const playerId = req.body.playerId
      if(playerId === undefined) { res.status(400).json({message:'undefined playerId'}); return; }

      const newState = moduleCode.Join(fromJS(currentState), playerId)
      res.json(createRetVal(moduleCode,newState))
    })

    // Post a game state and a ordered array of actions
    // Returns a new game state
    router.post(`${codePrefix}/nextstate`, (req, res) => {
      const state = req.body.state
      if(state === undefined) { res.status(400).json({message:'undefined state'}); return; }

      const actions = req.body.actions
      if(actions === undefined) { res.status(400).json({message:'undefined actions'}); return; }

      const newState = _.reduce(actions,(currentState,action)=>{
        return moduleCode.GetNextState(currentState,action.playerId,action.action)
      }, fromJS(state))

      res.json(createRetVal(moduleCode,newState))
    })

    return module.code||moduleCode.Info().code
  })

  router.get('/modules', (req, res) => {
    res.json(modules)
  })
  router.get('/info', (req, res) => {
    res.json(config.info)
  })

  return router
}

module.exports = { init }
