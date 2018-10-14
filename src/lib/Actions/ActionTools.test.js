const should = require('should')

const Types = require('../Types')
const Action = require('./Action')
const ActionTools = require('./ActionTools')


describe('ActionTools',()=>{

  describe('CreateVoidAction',()=>{
    it('should create new action with no parameters',()=>{
      const action = ActionTools.CreateVoidAction('pass')
      action.name.should.equal('pass')
      action.parameterDefs.should.eql({})
    })
  })

  describe('CreateSelectOneAction',()=>{
    it('should create new action with a single select',()=>{
      const action = ActionTools.CreateSelectOneAction('play','position',[1,2,3])
      action.name.should.equal('play')
      action.parameterDefs.should.eql({
        position:Types.Select.CreateDef([1,2,3],1,1,false)
      })
    })
  })

  describe('SelectFirstActionFirstOption',()=>{
    it('should select this first action in the list and populate its parameters',()=>{
      const actions = [
        ActionTools.CreateSelectOneAction('playThis','position',[3,2,1]),
        ActionTools.CreateSelectOneAction('play','position',[1,2,3]),
      ]

      ActionTools.SelectFirstActionFirstOption(actions).should.eql({
        name: 'playThis',
        parameters: {
          position: [3],
        }
      })
    })

    it('should select this first action in the list and populate its parameters but exclude the required ones',()=>{
      const actions = [
        ActionTools.CreateSelectOneAction('play','position',[1,2,3]),
        ActionTools.CreateSelectOneAction('playThis','position',[3,2,1]),
        ActionTools.CreateSelectOneAction('play','position',[1,2,3]),
      ]

      ActionTools.SelectFirstActionFirstOption(actions,["play"]).should.eql({
        name: 'playThis',
        parameters: {
          position: [3],
        }
      })
    })


  })

})
