const should = require('should')

const elo = require('./elo')

describe('elo',()=>{
  it('should throw an exception if an incorrect winLossDraw indicator is passed',()=>{
    const f = () => {
      elo(32,2400,2000,"xxx")
    }
    f.should.throw({message:"unknown winLossDraw"})
  })


  it('should calculate the correct elo',()=>{
    elo(32,2400,2000,"win").should.be.approximately(2403,0.5)
  })
  it('should calculate the correct elo',()=>{
    elo(32,2000,2400,"loss").should.be.approximately(1997,0.5)
  })
})
