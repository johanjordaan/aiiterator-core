const _ = require('lodash')
const inquirer = require('inquirer');

const { Action } = require('../../Actions')

const Show = (items) => {
  const choices = items.map((item)=>{
    return {
      name:item.get('name'),
      value:item,
    }
  }).concat(
    [{name:"cancel",value:"cancel"}]
  ).toArray()

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'selectedItem',
        message: 'choose an action',
        choices,
      },
    ]).then((resp) => {
      if(resp.selectedItem === 'cancel') return

      return Promise.all(resp.selectedItem.get('parameterDefs').map((parameterDef,parameterName)=>{
        const parameterType = parameterDef.get('type')

        if(parameterType === 'Select') {
          return inquirer
            .prompt([
              {
                type: 'list',
                name: 'selectedItem',
                message: 'choose an action',
                choices: parameterDef.get('options').toArray(),
              }
            ]).then((resp)=>{
              const retVal = {}
              retVal[parameterName] = resp.selectedItem
              return retVal
            })
        } else if(type === 'String') {
          return Promise.resolve()
        } else if(type === 'Integer') {
          return Promise.resolve()
        }

      }).toArray()).then((results)=>{
        const parameters = _.reduce(results,(acc,o)=>{
          return _.merge(acc,o)
        },{})

        return Action.Create(resp.selectedItem,parameters)
      })



      return {}
    })
}


module.exports = {
  Show,
}
