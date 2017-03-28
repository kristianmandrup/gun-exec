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

  // could be used in case command is {val: cb, shallow: true}
  function shallow(value) {
    let copy = Object.assign({}, value)
    delete copy._
    return copy
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
      let keys = Object.keys(command)
      let key = keys[0]
      let commandName = key
      let args = command[key]

      // rewind to root level of gunInstance
      if (command.root && isValidRoot(command, node)) {
        log('info', 'chain reset to root')
        node = gunInstance
      }

      let ctx = node
      let returnVal
      args = normalizeArgs(args)
      log('info', 'command', command)
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