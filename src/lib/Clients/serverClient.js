

const init = (host,app) => {
  const base = host
  const restClient = require('./restClient').init(app)

  const register = async (email, password) => {
    try {
      const result = await restClient.POST(base,'/auth/register',{email,password},'')
      return result
    } catch(error) {
      return { error }
    }
  }

  const login = async (email, password) => {
    try {
      const result = await restClient.POST(base,'/auth/login',{email,password},'')
      return result.token
    } catch(error) {
      return { error }
    }
  }

  const createPlayer = async (name, token) => {
    try {
      const result = await restClient.POST(base,'/players/',{name},token)
      return result.newPlayer
    } catch(error) {
      return { error }
    }
  }

  const listAllPlayers = async (token) => {
    try {
      const result = await restClient.GET(base,'/players/',token)
      return result.players
    } catch(error) {
      return { error }
    }
  }


  const become = async (playerId,token) => {
    try {
      const result = await restClient.POST(base,'/auth/become',{playerId},token)
      return result.token
    } catch(error) {
      return { error }
    }
  }

  const whoami = async (token) => {
    try {
      const result = await restClient.GET(base,'/auth/whoami',token)
      return result
    } catch(error) {
      return { error }
    }
  }

  const listAllGameServers = async (token) => {
    try {
      const result = await restClient.GET(base,'/gameservers/',token)
      return result.gameservers
    } catch(error) {
      return { error }
    }
  }

  const listAllGameTypes = async (token) => {
    try {
      const result = await restClient.GET(base,'/gametypes/',token)
      return result.gametypes
    } catch(error) {
      return { error }
    }
  }

  const loginAndBecome = async (email, password, playerId) => {
    return await become(playerId, await login(email, password) )
  }

  const listAllPools = async (token) => {
    try {
      const result = await restClient.GET(base,'/pools/',token)
      return result.pools
    } catch(error) {
      return { error }
    }
  }

  const joinPool = async (poolId,token) => {
    try {
      const result = await restClient.PUT(base,`/pools/${poolId}/join`,{},token)
      return result
    } catch(error) {
      return { error }
    }
  }



  const listMyPlayers = async (token) => {
    const result = await restClient.GET(base,'/players/?mine',token)
    return result.players
  }


  const listMyPools = async (token) => {
    const result = await restClient.GET(base,'/pools/?mine',token)
    return result.pools
  }


  const listActiveGames = async (token) => {
    const result = await restClient.GET(base,`/games`,token)
    return result.games //[gameId,currentGameStateId]
  }

  const getGameState = async (gameId,gameStateId,token) => {
    const result = await restClient.GET(base,`/games/${gameId}/gamestates/${gameStateId}`,token)
    return result
  }

  const submitAction = async (gameId,gameStateId,action,token) => {
    const result = await restClient.PUT(base,`/games/${gameId}/gamestates/${gameStateId}`,action,token)
    return result
  }

  return {
    register,
    login,
    createPlayer,
    listAllPlayers,
    listMyPlayers,
    become,
    whoami,
    listAllGameServers,
    listAllGameTypes,
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
