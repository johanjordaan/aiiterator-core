if (require.main === module) {
  const c = require('./src/console')
} else {
  module.exports = {
    utils: require('./src/lib/utils'),
    Types: require('./src/lib/Types'),
    Actions: require('./src/lib/Actions'),
    Clients: require('./src/lib/Clients'),
  }
}
