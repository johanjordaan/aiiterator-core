const _ = require('lodash')
const inquirer = require('inquirer');

const Show = (prompt,labelKey,items,selectedItem) => {

  const choices = _.map(items,(item)=>{
    const name = _.isFunction(labelKey) ? labelKey(item) : item[labelKey]
    return {
      name:`${name}`,
      value:item,
    }
  }).concat(
    {name:"__abort",value:"__abort"}
  )

  const selectedIndex = _.findIndex((items),(item)=>{
    const name = _.isFunction(labelKey) ? labelKey(item) : item[labelKey]
    return name === selectedItem
  })

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'selectedItem',
        message: 'whom ?',
        choices,
        default: selectedIndex
      },
    ]).then((resp) => {
      return resp.selectedItem
    })
}


module.exports = {
  Show,
}
