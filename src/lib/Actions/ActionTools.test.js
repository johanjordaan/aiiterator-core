const should = require('should')
const _ = require('lodash')

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
        ActionTools.CreateSelectOneAction('playSomeOther','position',[1,2,3]),
      ]

      ActionTools.SelectFirstActionFirstOption(actions,["play"]).should.eql({
        name: 'playThis',
        parameters: {
          position: [3],
        }
      })
    })
  })

  describe('SelectRandomActionRandomOption',()=>{
    it('should return null if no valid options',()=>{
      const actions = [
        ActionTools.CreateSelectOneAction('play','position',[1,2,3]),
        ActionTools.CreateSelectOneAction('playThis','position',[3,2,1]),
      ]

      const selectedAction = ActionTools.SelectRandomActionRandomOption(actions,["play","playThis"])
      expect(selectedAction).toBe(null)
    })


    it('should return a randomly selected action and option',()=>{
      const actions = [
        ActionTools.CreateSelectOneAction('play','position',[1,2,3]),
        ActionTools.CreateSelectOneAction('playThis','position',[3,2,1]),
        ActionTools.CreateSelectOneAction('playSomeOther','position',[1,2,3]),
      ]

      const selectedAction = ActionTools.SelectRandomActionRandomOption(actions,["play"])
      const target = _.find(actions,(action)=>action.name=selectedAction.name)
      expect(_.includes(target.parameterDefs.position.options,selectedAction.parameters.position[0])).toBe(true)

    })
  })


})
