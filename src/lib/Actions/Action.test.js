const should = require('should');

const Types = require('../Types')
const Actions = require('./')

describe('Action',()=>{

  const targetDef = Types.Select.CreateDef(["orc","human"],1,1,false)
  const manaDef = Types.Integer.CreateDef(2,5,false)

  const actionDef = Actions.Action.CreateDef('cast',{
    target:targetDef,
    mana:manaDef
  })

  describe('CreateDef',()=>{
  	it('should create a valid action definition ',()=>{
      // TODO : Inpliment
  	})
  })

  const validAction = Actions.Action.Create(actionDef,{
    target:["orc"],
    mana:4,
  })

  const invalidAction = Actions.Action.Create(actionDef,{
    target:["tree"],
    mana:12,
  })


  describe('Create',()=>{
    it('should create an action based on a action definition',() => {
      validAction.should.have.property('parameters').which.is.a.Object()
    })
  })

  describe("Validate",()=>{
    it("should validate a valid action as valid",()=>{
      Actions.Action.Validate(validAction, actionDef).should.equal(true)
    })
    it("should validate a invalid action as invalid",()=>{
      Actions.Action.Validate(invalidAction, actionDef).should.equal(false)
    })

  })

})
