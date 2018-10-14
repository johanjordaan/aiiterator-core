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
      const selectedIndexes = _.reduce(_.fill(new Array(selectionCount),1),(acc,val)=>{
        let i = _.random(0,parameterDef.options.length-1)
        let count = 0
        if(parameterDef.allowDuplicates !== true) {
          while(_.includes(acc,i)) {
            i = _.random(0,parameterDef.options.length-1)
            count=count+1
            if(count>100) throw new Error("To many count")
          }
        }

        acc.push(i)
        return acc
      },[])
      return _.at(parameterDef.options,selectedIndexes)
    }
  } else if(parameterDef.type === 'Integer') {
    return rnd.rndIntBetween(parameterDef.min,parameterDef.max);
  }

  throw new Error(`parameterDef.type should be [String,Select or Integer] not [${parameterDef.type}]`)
}

module.exports = {
  CreateParameter,
}
