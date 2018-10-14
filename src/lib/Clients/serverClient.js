

const init = (app) => {
  const restServer = require('./restCalls').init('https://api.aiiterator.com',app)

  const login = async (email, password) => {
    const result = await restServer.POST('/auth/login',{email,password},'')
    return result.token
  }

  const listAllPlayers = async (token) => {
    const result = await restServer.GET('/players/',token)
    return result.players
  }

  const listMyPlayers = async (token) => {
    const result = await restServer.GET('/players/?mine',token)
    return result.players
  }

  const become = async (playerId,token) => {
    const result = await restServer.POST('/auth/become',{playerId},token)
    return result.token
  }

  const loginAndBecome = async (email, password, playerId) => {
    return await become(playerId, await login(email, password) )
  }

  const listAllPools = async (token) => {
    const result = await restServer.GET('/pools/',token)
    return result.pools
  }

  const listMyPools = async (token) => {
    const result = await restServer.GET('/pools/?mine',token)
    return result.pools
  }

  const joinPool = async (poolId,token) => {
    const result = await restServer.PUT(`/pools/${poolId}/join`,{},token)
    return result
  }

  const listActiveGames = async (token) => {
    const result = await restServer.GET(`/games`,token)
    return result.games //[gameId,currentGameStateId]
  }

  const getGameState = async (gameId,gameStateId,token) => {
    const result = await restServer.GET(`/games/${gameId}/gamestates/${gameStateId}`,token)
    return result
  }

  const submitAction = async (gameId,gameStateId,action,token) => {
    const result = await restServer.PUT(`/games/${gameId}/gamestates/${gameStateId}`,action,token)
    return result
  }

  return {
    login,
    listAllPlayers,
    listMyPlayers,
    become,
    loginAndBecome,
    listAllPools,
    listMyPools,
    joinPool,
    listActiveGames,
    getGameState,
    submitAction,
  }
}




module.exports = {
  init
}
