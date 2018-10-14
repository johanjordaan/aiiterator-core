const _ = require('lodash')

const winLossDrawLookup = {
  "win":1,
  "loss":0,
  "draw":0.5
}

module.exports = (K,myRating,opponentRating,winLossDraw) => {
  if(!_.includes(_.keys(winLossDrawLookup),winLossDraw)) throw new Error("unknown winLossDraw")

  const myR = Math.pow(10,myRating/400)
  const opponentR = Math.pow(10,opponentRating/400)
  const S = winLossDrawLookup[winLossDraw]
  const E = myR/(myR+opponentR)
  return myRating + K * (S - E)
}
