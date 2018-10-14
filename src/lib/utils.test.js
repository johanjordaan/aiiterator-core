const should = require('should')
const uuidv4 = require('uuid/v4');

const utils = require('./utils')

describe('utils',()=>{

  describe('hashCode',()=>{
    it('should convert as string to a integer',()=>{
      utils.hashCode('d855053d-849c-4a02-8b60-e851967de303').should.equal(-1546237575)
    })
  })

})
