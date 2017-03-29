export default function createExec(gun, opts = {}) {
  let {
    logging,
    log,
  } = opts

  function isObj(obj) {
    return (typeof commands !== 'object')
  }

  function arrWrapObj(obj) {
    if (!isObj(obj)) {
      throw new Error(`Each command must be an object, was: ${typeof obj} ${obj}`)
    }
    return [obj]
  }

  function flatten(a) {
    return Array.isArray(a) ? [].concat(...a.map(flatten)) : a;
  }

  function normalizeArgs(args) {
    args = flatten(args)
    return normalizeArr(args)
  }

  function normalizeArr(obj) {
    return Array.isArray(obj) ? obj : arrWrapObj(obj)
  }

  function defaultLog(level, ...args) {
    if (logging) {
      console.log(...args)
    }
  }

  log = log || defaultLog

  function validateCommand(commandName, args) {
    if (!Array.isArray(args)) {
      throw new Error(`Invalid arguments ${args}`)
    }
    if (typeof commandName !== 'string') {
      throw new Error(`Invalid command ${commandName}`)
    }
  }

  function defaultIsValidRoot(command, node) {
    if (command === 'put' || command === 'set') {
      return false
    }
    return true
  }
  let isValidRoot = opts.isValidRoot || defaultIsValidRoot

  return function execute(gunInstance, commands, options) {
    logging = options ? options.logging : logging

    // must be Object or Array
    if (!isObj(commands)) {
      log('error', 'execute: Invalid commands ', commands)
      throw new Error('Execute command argument must be an Object or Array')
    }
    commands = normalizeArr(commands)

    return commands.reduce((node, command) => {
      // rewind to root level of gunInstance
      if (command.root && isValidRoot(command, node)) {
        log('info', 'chain reset to root')
        node = gunInstance
        delete command.root
      }
      log('info', 'command', command)

      let name
      let args = []
      if (command.name) {
        // {name: 'put', args: [{ name: 'kris' }, { sync: false }] }
        name = command.name
        args = command.args

        if (command.model) {
          args = command.model || args
        }
      } else {
        // extract from key/value pair
        // { put: [{ name: 'kris' }, { sync: false }] }
        let keys = Object.keys(command)
        name = keys[0]
        args = command[name]
      }

      let commandName = name

      let ctx = node
      let returnVal
      args = normalizeArgs(args)

      function validateCommand(commandName, args) {
        if (!Array.isArray(args)) {
          throw new Error(`Invalid arguments ${args}`)
        }
        if (typeof commandName !== 'string') {
          throw new Error(`Invalid command ${commandName}`)
        }
      }

      validateCommand(commandName, args)

      log('info', 'execute', commandName, args)
      try {
        returnVal = node[commandName].apply(ctx, args)
      } catch (e) {
        log('error', node)
        throw new Error(`execute: Failed applying ${command}`)
      }
      return returnVal
    }, gunInstance)
  }
}