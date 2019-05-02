const should = require('should')
const {
  Map,
  List,
} = require('immutable')


const Types = require('./')

describe('Types',()=>{

  describe('TypeTools',()=>{
    describe('CreateParameter',()=>{
      it('should create a string parameter',()=>{
        const parameterDef = Types.String.CreateDef()
        const parameter = Types.TypeTools.CreateParameter(parameterDef)

        parameter.should.equal("Some String")
      })

      it('should create a integer parameter',()=>{
        const parameterDef = Types.Integer.CreateDef(1,10)
        const parameter = Types.TypeTools.CreateParameter(parameterDef)

        parameter.should.be.within(1,10)
      })

      it('should create a select parameter',()=>{
        const parameterDef = Types.Select.CreateDef(['a','b','c'],1,1,false)
        const parameter = Types.TypeTools.CreateParameter(parameterDef,[1])

        parameter.should.eql(['b'])
      })

      it('should create a select parameter',()=>{
        const parameterDef = Types.Select.CreateDef(['a','b','c'],1,2,false)
        const parameter = Types.TypeTools.CreateParameter(parameterDef,[0,2])

        parameter.should.eql(['a','c'])
      })

      it('should create a select parameter',()=>{
        const parameterDef = Types.Select.CreateDef(['a','b','c'],1,1,false)
        const parameter = Types.TypeTools.CreateParameter(parameterDef)

        parameter.length.should.eql(1)
      })

      it('should create a select parameter',()=>{
        const parameterDef = Types.Select.CreateDef(['a'],2,2,true)
        const parameter = Types.TypeTools.CreateParameter(parameterDef)

        parameter.length.should.eql(2)
      })


      it('should create a select parameter',()=>{
        const parameterDef = Types.Select.CreateDef(['a','b','c'],1,1,false)
        const parameter = Types.TypeTools.CreateParameter(parameterDef)

        parameter.length.should.eql(1)
      })

      it('should create a select parameter',()=>{
        const parameterDef = Types.Select.CreateDef(['b','b','b','b','b','b'],2,2,true)
        const parameter = Types.TypeTools.CreateParameter(parameterDef)

        parameter.length.should.eql(2)
      })



      it('should throw an error if an invalid type def is supplied',()=>{
        const f = () => {
          const parameter = Types.TypeTools.CreateParameter({type:'nonetype'})
        }
        f.should.throw({message:"parameterDef.type should be [String,Select or Integer] not [nonetype]"})
      })


    })
  })


})
