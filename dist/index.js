'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = createExec;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createExec(gun) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  function isObj(obj) {
    return (typeof commands === 'undefined' ? 'undefined' : (0, _typeof3.default)(commands)) !== 'object';
  }

  function arrWrapObj(obj) {
    if (!isObj(obj)) {
      throw new Error('Each command must be an object, was: ' + (typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) + ' ' + obj);
    }
    return [obj];
  }

  function normalizeArr(obj) {
    return Array.isArray(obj) ? obj : arrWrapObj(obj);
  }

  function defaultLog(level) {
    if (opts.logging) {
      var _console;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      (_console = console).log.apply(_console, args);
    }
  }

  var logging = opts.logging,
      log = opts.log;


  log = log || defaultLog;

  return function execute(g, commands) {
    // must be Object or Array
    if (!isObj(commands)) {
      log('error', 'execute: Invalid commands ', commands);
      throw new Error('Execute command argument must be an Object or Array');
    }
    commands = normalizeArr(commands);

    return commands.reduce(function (node, command) {
      var keys = (0, _keys2.default)(command);
      var key = keys[0];
      var commandName = key;
      var args = command[key];

      args = normalizeArr(args);
      // log('info', 'node', node)
      log('info', 'command', command);
      log('info', 'execute', commandName, args);
      try {
        node = node[commandName].apply(node, args);
      } catch (e) {
        log('error', node);
        throw new Error('execute: Failed applying ' + command);
      }
      log('info', 'return', node);
      return node;
    }, gun);
  };
}
//# sourceMappingURL=index.js.map
