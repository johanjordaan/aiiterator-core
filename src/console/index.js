const _ = require('lodash')
const uuidv4 = require('uuid/v4');
const {
  Map,
  List,
} = require('immutable')

const inquirer = require('inquirer');

const clear = require('clear')
const chalk = require('chalk')
const figlet = require('figlet')
const clui = require('clui')
const Gauge = clui.Gauge;
const Progress = clui.Progress;

const Menu = require('./Menu')
const ActionMenu = require('./ActionMenu')

const { Action } = require('../../Actions')

const Container = require('../../lib/Container')
const State = require('../../lib/State')


const ttt = require('../../examples/tictactoe')
const modules = [
  ttt
]
const moduleLookup = {}
moduleLookup[ttt.Info().code] = 0
let selectedModule = null;

const print = (str) => {
  console.log(str)
}


const clearScreen = () => {
  clear()
  const welcomeAscii = figlet.textSync('... act now ...', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default'
  })
  print(`${chalk.keyword('orange')(welcomeAscii)}`);
}
clearScreen()

let state = State.Create()
try {
  state = State.Load('stateDump.json')
} catch(err) {
}

const commands = {

  cls: () => {
    clearScreen()
    return Promise.resolve()
  },

  exit: () => {
    process.exit()
  },

  dump: () => {
    State.Dump(state,'stateDump.json')
    return Promise.resolve()
  },

  cu: () => {
    return inquirer
      .prompt({
        type: 'string',
        name: 'newUserName',
        message: 'name',
      })
      .then((resp)=> {
        if(resp.newUserName !== '' ) {
          const newUser = Map({id:resp.newUserName,name:resp.newUserName})
          state = State.AddUser(state,newUser)
          state = State.SetSelectedUser(state, resp.newUserName)
        }
      })
  },

  su: () => {
    const options = _.filter(State.GetUsers(state).toJS(),(user)=>{
      return user.id !== State.GetSelectedUser(state).get('id')
    })

    return Menu.Show("whom?","name",options)
      .then((selection)=>{
        if(!_.isString(selection)) {
          state = State.SetSelectedUser(state, selection.id)
          return Promise.resolve()
        }
      })
  },

  whoami: () => {
    const user = State.GetSelectedUser(state)
    if(user===null) {
      print('No users')
    } else {
      print(user.get('name'))
    }
    return Promise.resolve()
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
  commands['dump']()
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
  if(State.GetSelectedUser(state)!==null) {
    p = State.GetSelectedUser(state).get('id')
  }
  var commandPrompt = {
    type: 'input',
    name: 'command',
    message: `${p} >>`,
  };

  inquirer
    .prompt([commandPrompt])
    .then(answer => {
      if(answer.command in commands) {
        commands[answer.command]().then(repl)
      } else {
        repl()
      }
    });
}
repl()
