

const init = (host,app) => {
  const base = host
  const restClient = require('./restClient').init(app)

  const register = async (email, password) => {
    const result = await restClient.POST(base,'/auth/register',{email,password},'')
    return result.user
  }

  const login = async (email, password) => {
    const result = await restClient.POST(base,'/auth/login',{email,password},'')
    return result.token
  }

  const listMyPlayers = async (token) => {
    const result = await restClient.GET(base,'/players/?mine',token)
    return result.players
  }

  const listPlayers = async (token) => {
    const result = await restClient.GET(base,'/players/',token)
    return result.players
  }


  const createPlayer = async (name, token) => {
    const result = await restClient.POST(base,'/players/',{name},token)
    return result.player
  }

  const become = async (playerId, token) => {
    const result = await restClient.POST(base,'/auth/become',{playerId},token)
    return result.token
  }

  const whoami = async (token) => {
    const result = await restClient.GET(base,'/auth/whoami',token)
    return result.loggedinuser
  }

  const loginAndBecome = async (email, password, playerId) => {
    return await become(playerId, await login(email, password) )
  }

  const listOpenMatches = async (token) => {
    const result = await restClient.GET(base,'/matches/',token)
    return result.matches
  }

  const createMatch = async (gameTypeId, bestof, poolId, token) => {
    const result = await restClient.POST(base,'/matches/',{gameTypeId,bestof,poolId},token)
    return result.match
  }

  const joinMatch = async (matchId, token) => {
    const result = await restClient.PUT(base,`/matches/${matchId}`,{},token)
    return result.match
  }

  const getGameState = async (gameId,gameStateId,token) => {
    const result = await restClient.GET(base,`/games/${gameId}/gamestates/${gameStateId}`,token)
    return result.gamestate
  }

  const submitAction = async (gameId,gameStateId,action,token) => {
    const result = await restClient.PUT(base,`/games/${gameId}/gamestates/${gameStateId}`,action,token)
    return result.gamestate
  }

  return {
    register,
    login,
    listPlayers,
    listMyPlayers,
    createPlayer,
    become,
    loginAndBecome,
    whoami,

    listOpenMatches,
    createMatch,
    joinMatch,
    getGameState,
    submitAction,
  }
}




module.exports = {
  init
}
