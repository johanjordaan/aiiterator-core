const _ = require('lodash')
const fs = require('fs')
const uuidv4 = require('uuid/v4')
const {
  Map,
  List,
} = require('immutable')

const inquirer = require('inquirer')

const clear = require('clear')
const chalk = require('chalk')
const figlet = require('figlet')
const clui = require('clui')
const Gauge = clui.Gauge
const Progress = clui.Progress

const Menu = require('./Menu')
const ActionMenu = require('./ActionMenu')

const { Action } = require('../lib/Actions')
const serverClient = require('../lib/Clients').serverClient.init('http://localhost:6660')

const print = (str) => {
  console.log(str)
}

const clearScreen = () => {
  clear()
  const welcomeAscii = figlet.textSync('... aiiterator ...', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default'
  })
  print(`${chalk.keyword('orange')(welcomeAscii)}`);
}
clearScreen()

const dumpState = (state) => {
  fs.writeFileSync('./state.json',JSON.stringify(state))
}
const loadState = () => {
  const defaultState = {
    users: {},
    currentUser: null
  }

  try {
    const stats = fs.lstatSync('./state.json');
    if(!stats.isFile()) {
      return defaultState
    } else {
      return JSON.parse(fs.readFileSync('./state.json'))
    }
  } catch(err) {
    return defaultState
  }
}

const state = loadState()
const commands = {

  cls: () => {
    clearScreen()
    return Promise.resolve()
  },

  exit: () => {
    dumpState(state)
    process.exit()
  },

  register: async () => {
    const input = await inquirer.prompt([
      { type: 'string', name: 'email', message: 'email'},
      { type: 'password', name: 'password', message: 'password'},
      { type: 'password', name: 'password_confirm', message: 'password'},
    ])
    if(input.password !== input.password_confirm) {
      print(`passwords don't match`)
      return
    }
    const result = await serverClient.register(input.email,input.password)
    if(result.error) {
      print(result.error)
    } else {
      state.users[input.email] = { token:result }
      state.currentUser = input.email
      dumpState(state)
      print(result)
    }
  },

  login: async () => {
    const input = await inquirer.prompt([
      { type: 'string', name: 'email', message: 'email'},
      { type: 'password', name: 'password', message: 'password'},
    ])
    const result = await serverClient.login(input.email,input.password)
    if(result.error) {
      print(result.error)
    } else {
      state.users[input.email] = { token:result }
      state.currentUser = input.email
      dumpState(state)
    }

  },

  cp: async () => {
    const input = await inquirer.prompt([
      { type: 'string', name: 'name', message: 'name'},
    ])
    const result = await serverClient.createPlayer(input.name,state.users[state.currentUser].token)
    if(result.error) {
      print(result.error)
    } else {
      print(result.id)
    }
  },

  become: async () => {
    const input = await inquirer.prompt([
      { type: 'string', name: 'playerId', message: 'playerId'},
    ])
    const result = await serverClient.become(input.playerId,state.users[state.currentUser].token)
    if(result.error) {
      print(result.error)
    } else {
      state.users[input.email] = { token:result }
      state.currentUser = input.email
      dumpState(state)
    }
  },

  whoami: async () => {
    const result = await serverClient.whoami(state.users[state.currentUser].token)
    if(result.error) {
      print(result.error)
    } else {
      print(result)
    }
  },

  ls: async (what) => {
    let result = { error: `unknown parameter to ls [${what}]`}
    if(what === 'players') {
      result = await serverClient.listAllPlayers(state.users[state.currentUser].token)
    }

    if(result.error) {
      print(result.error)
    } else {
      _.each(result,print)
    }
  },


  start: () => {
    if(State.GetSelectedUser(state) === null) {
      print("Please select a user first")
      return Promise.resolve()
    } else {
      const user = State.GetSelectedUser(state)
      return Menu.Show("which?",(m)=>m.Info().name,modules)
        .then((selection)=>{
          if(!_.isString(selection)) {
            const ggg = selection.Start(user.get('id'))
            const game = Map({id:uuidv4(),info:Map(selection.Info()),state:ggg})
            state = State.AddGame(state,game)
            state = State.SetSelectedGame(state, game.get('id'))
          }
        })
    }
  },

  join: () => {
    if(state.selectedUser === null) {
      print("Please select a user first")
      return Promise.resolve()
    } else {
      const user = State.GetSelectedUser(state)
      return Menu.Show("which?",(m)=>m.Info().name,modules)
        .then((gameEngine)=>{

          const games = State.GetGames(state)
          const options = games.filter((game)=>{
            return ttt.HasOpenSlots(game.get('state'))
          }).map((game)=>{
            return {
              id:game.get('id'),
              value:ttt.ToSlug(game.get('state')),
            }
          }).toJS()
          return Menu.Show("which?",'value',options)
            .then((gameToJoin)=>{
              if(!_.isString(gameToJoin)) {
                const gameState = Container.GetItem(state.get('games'),gameToJoin.id)
                const game = gameEngine.Join(gameState.get('state'),user.get('id'))
                const newGameState = gameState.set('state',game)
                state = State.UpdateGame(state,newGameState)
                state = State.SetSelectedGame(state, newGameState.get('id'))
              }
          })
        })
    }
  },

  lsm: () => {
    if(!modules || modules.length===0) {
      print("No modules")
    } else {
      _.each(_.keys(modules),(module) => {
        print(`${modules[module].Info().name}`)
      })
    }
    return Promise.resolve()
  },

  lsg: () => {
    const games = State.GetGames(state)
    const currentGame = State.GetSelectedGame(state)

    if(games.size===0) {
      print("No games")
    } else {
      games.map((game)=>{
        if(game.get('id') === currentGame.get('id'))
          print('*'+ttt.ToSlug(game.get('state')))
        else
          print(' '+ttt.ToSlug(game.get('state')))
      })
    }
    return Promise.resolve()
  },

  lsu: () => {
    const users = State.GetUsers(state)
    const currentUser = State.GetSelectedUser(state)

    if(users.size===0) {
      print("No users")
    } else {
      users.map((user)=>{
        if(user === currentUser)
          print(`*${user.get('name')}`)
        else
          print(` ${user.get('name')}`)
      })
    }

    return Promise.resolve()
  },

  sg: () => {
    const games = State.GetGames(state)
    const options = games.map((game)=>{
      return {
        id:game.get('id'),
        value:ttt.ToSlug(game.get('state')),
      }
    }).toJS()
    return Menu.Show("which?",'value',options)
      .then((selection)=>{
        if(!_.isString(selection)) {
          state = State.SetSelectedGame(state, selection.id)
          return Promise.resolve()
        }
      })
  },

  csg: () => {
    const selectedGame = State.GetSelectedGame(state)
    if(selectedGame===null) {
      print('No selected game')
    } else {
      print(ttt.ToSlug(selectedGame.get('state')))
    }
    return Promise.resolve()

  },

  play: () => {
    const currentGame = State.GetSelectedGame(state)
    const currentUser = State.GetSelectedUser(state)

    const currentModule = modules[moduleLookup[currentGame.get('info').get('code')]]
    const currentUserActions = currentModule.GetPlayerActions(currentGame.get('state'),currentUser.get('id'))
    print(currentModule.ToString(currentGame.get('state')))
    return ActionMenu
      .Show(currentUserActions)
      .then((action)=>{
        if(action === undefined) return
        const newGameState = currentModule.GetNextState(currentGame.get('state'),currentUser.get('id'),action)
        state = State.UpdateGame(state,currentGame.set('state',newGameState))
        print(currentModule.ToString(newGameState))
      })
  },
}


const exitHandler = (options, exitCode) => {
  if (options.exit) {
    commands['exit']()
  }
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGTERM', exitHandler.bind(null,{cleanup:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

var p = ''
const repl = () => {
  var commandPrompt = {
    type: 'input',
    name: 'command',
    message: `${p} >>`,
  };

  inquirer
    .prompt([commandPrompt])
    .then(answer => {
      const tokens = _.map(_.filter(answer.command.split(/\W/),(i)=>i.length>0),(i)=>i.trim())
      if(tokens[0] in commands) {
        try {
          commands[tokens[0]](tokens[1]).then(repl)
        } catch(err) {
          print(err)
          repl()
        }
      } else {
        print(`unknown command [${answer.command}]`)
        repl()
      }
    });
}
repl()
