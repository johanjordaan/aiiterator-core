const _ = require('lodash')

const Types =  require('../Types')
const CreateDef = (name,parameterDefs) => {
  // TODO: Check that parameterdefs are types

  return {
    name,
    parameterDefs
  }
}

const Create = (actionDef,parameters) => {

  // TODO : Some validation maybe?

  return {
    name:actionDef.name,
    parameters
  }
}

const Validate = (action,actionDef) => {

  // TODO : Do a full comparison
  // TODO : Validation list / feedback
  // TODO : Null exception idf def not in names
  return _.reduce(actionDef.parameterDefs,(valid,def,name)=>{
    return Types[def.type].Validate(action.parameters[name],def) && valid
  },true)

}


module.exports = {
  CreateDef,
  Create,
  Validate,
}
