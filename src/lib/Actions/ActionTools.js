const _ = require('lodash')

const Types = require('../Types')
const Action = require('./Action')


const CreateVoidAction = (name) => {
  return Action.CreateDef(name,{})
}

const CreateSelectOneAction = (name,optionsName,options) => {
  const parameterDefs = {}
  parameterDefs[optionsName] = Types.Select.CreateDef(options,1,1,false)
  return Action.CreateDef(name,parameterDefs)
}

const SelectFirstActionFirstOption = (actionsDefs,exclude) => {
  const actionDef = _.find(actionsDefs,(actionDef)=>{
    return !_.includes(exclude,actionDef.name)
  })

  const parameters = _.fromPairs(_.map(_.toPairs(actionDef.parameterDefs),([key,parameterDef])=>{
    return [key,Types.TypeTools.CreateParameter(parameterDef,[0])]
  }))

  return Action.Create(actionDef,parameters)
}

const SelectRandomActionRandomOption = (actionsDefs,exclude) => {
  const actionDef = _.sample(_.filter(actionsDefs,(actionDef)=>{
    return !_.includes(exclude,actionDef.name)
  }))

  if(actionDef === undefined) return null

  const parameters = _.fromPairs(_.map(_.toPairs(actionDef.parameterDefs),([key,parameterDef])=>{
    return [key,Types.TypeTools.CreateParameter(parameterDef)]
  }))

  return Action.Create(actionDef,parameters)
}


module.exports = {
  CreateVoidAction,
  CreateSelectOneAction,

  SelectFirstActionFirstOption,
  SelectRandomActionRandomOption,
}
