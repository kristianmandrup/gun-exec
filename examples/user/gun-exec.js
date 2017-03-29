'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = createExec;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createExec(gun) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var logging = opts.logging,
      log = opts.log;


  function isObj(obj) {
    return (typeof commands === 'undefined' ? 'undefined' : (0, _typeof3.default)(commands)) !== 'object';
  }

  function arrWrapObj(obj) {
    if (!isObj(obj)) {
      throw new Error('Each command must be an object, was: ' + (typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) + ' ' + obj);
    }
    return [obj];
  }

  function flatten(a) {
    var _ref;

    return Array.isArray(a) ? (_ref = []).concat.apply(_ref, (0, _toConsumableArray3.default)(a.map(flatten))) : a;
  }

  function normalizeArgs(args) {
    args = flatten(args);
    return normalizeArr(args);
  }

  function normalizeArr(obj) {
    return Array.isArray(obj) ? obj : arrWrapObj(obj);
  }

  function defaultLog(level) {
    if (logging) {
      var _console;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      (_console = console).log.apply(_console, args);
    }
  }

  log = log || defaultLog;

  function validateCommand(commandName, args) {
    if (!Array.isArray(args)) {
      throw new Error('Invalid arguments ' + args);
    }
    if (typeof commandName !== 'string') {
      throw new Error('Invalid command ' + commandName);
    }
  }

  function defaultIsValidRoot(command, node) {
    if (command === 'put' || command === 'set') {
      return false;
    }
    return true;
  }
  var isValidRoot = opts.isValidRoot || defaultIsValidRoot;

  return function execute(gunInstance, commands, options) {
    logging = options ? options.logging : logging;

    // must be Object or Array
    if (!isObj(commands)) {
      log('error', 'execute: Invalid commands ', commands);
      throw new Error('Execute command argument must be an Object or Array');
    }
    commands = normalizeArr(commands);

    return commands.reduce(function (node, command) {
      // rewind to root level of gunInstance
      if (command.root && isValidRoot(command, node)) {
        log('info', 'chain reset to root');
        node = gunInstance;
        delete command.root;
      }
      log('info', 'command', command);

      var name = void 0;
      var args = [];
      if (command.name) {
        // {name: 'put', args: [{ name: 'kris' }, { sync: false }] }
        name = command.name;
        args = command.args;

        if (command.model) {
          args = command.model || args;
        }
      } else {
        // extract from key/value pair
        // { put: [{ name: 'kris' }, { sync: false }] }
        var keys = (0, _keys2.default)(command);
        name = keys[0];
        args = command[name];
      }

      var commandName = name;

      var ctx = node;
      var returnVal = void 0;
      args = normalizeArgs(args);

      function validateCommand(commandName, args) {
        if (!Array.isArray(args)) {
          throw new Error('Invalid arguments ' + args);
        }
        if (typeof commandName !== 'string') {
          throw new Error('Invalid command ' + commandName);
        }
      }

      validateCommand(commandName, args);

      log('info', 'execute', commandName, args);
      try {
        returnVal = node[commandName].apply(ctx, args);
      } catch (e) {
        log('error', node);
        throw new Error('execute: Failed applying ' + command);
      }
      return returnVal;
    }, gunInstance);
  };
}
//# sourceMappingURL=index.js.map
