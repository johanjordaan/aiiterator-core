const _ = require('lodash')

const rnd = require('lcg-rnd')
const Types = require('./')

const CreateParameter = (parameterDef,selectIndexes) => {

  if(parameterDef.type === 'String') {
    return "Some String"
  } else if(parameterDef.type === 'Select') {
    if(selectIndexes !== undefined) {
      return _.at(parameterDef.options,selectIndexes)
    } else {
      const selectionCount = _.random(parameterDef.min,parameterDef.max)

      if(parameterDef.allowDuplicates !== true) {
        return  _.sampleSize(parameterDef.options,selectionCount)
      } else {
        return _.reduce(_.fill(new Array(selectionCount),1),(acc,val)=>{
          let i = _.random(0,parameterDef.options.length-1)
          acc.push(parameterDef.options[i])
          return acc
        },[])
      }
    }
  } else if(parameterDef.type === 'Integer') {
    return rnd.rndIntBetween(parameterDef.min,parameterDef.max);
  }

  throw new Error(`parameterDef.type should be [String,Select or Integer] not [${parameterDef.type}]`)
}

module.exports = {
  CreateParameter,
}
