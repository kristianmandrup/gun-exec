export default function createExec(gun, opts = {}) {
  function isObj(obj) {
    return (typeof commands !== 'object')
  }

  function arrWrapObj(obj) {
    if (!isObj(obj)) {
      throw new Error(`Each command must be an object, was: ${typeof obj} ${obj}`)
    }
    return [obj]
  }

  function normalizeArr(obj) {
    return Array.isArray(obj) ? obj : arrWrapObj(obj)
  }

  function defaultLog(level, ...args) {
    if (opts.logging) {
      console.log(...args)
    }
  }

  let {
    logging,
    log,
  } = opts

  log = log || defaultLog

  return function execute(g, commands) {
    // must be Object or Array
    if (!isObj(commands)) {
      log('error', 'execute: Invalid commands ', commands)
      throw new Error('Execute command argument must be an Object or Array')
    }
    commands = normalizeArr(commands)

    return commands.reduce((node, command) => {
      let keys = Object.keys(command)
      let key = keys[0]
      let commandName = key
      let args = command[key]

      args = normalizeArr(args)
      // log('info', 'node', node)
      log('info', 'command', command)
      log('info', 'execute', commandName, args)
      try {
        node = node[commandName].apply(node, args)
      } catch (e) {
        log('error', node)
        throw new Error(`execute: Failed applying ${command}`)
      }
      log('info', 'return', node)
      return node
    }, gun)
  }
}