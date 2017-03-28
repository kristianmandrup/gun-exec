'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

  // could be used in case command is {val: cb, shallow: true}
  function shallow(value) {
    var copy = (0, _assign2.default)({}, value);
    delete copy._;
    return copy;
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
      var keys = (0, _keys2.default)(command);
      var key = keys[0];
      var commandName = key;
      var args = command[key];

      // rewind to root level of gunInstance
      if (command.root && isValidRoot(command, node)) {
        log('info', 'chain reset to root');
        node = gunInstance;
      }

      var ctx = node;
      var returnVal = void 0;
      args = normalizeArgs(args);
      log('info', 'command', command);
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
