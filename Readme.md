# Gun data API executer

![gun-exec](https://github.com/kristianmandrup/gun-exec/raw/master/army-guy.jpg)

## Install

npm: `npm i -S gun-exec` (soon)

yarn: `yarn add gun-exec` (soon)

from github: `npm i -S kristianmandrup/gun-exec`

### Dependencies

- `gun` v. 0.6 or higher

## Usage

Assumes [Babel.js](https://babeljs.io) or similar transpiler setup

```js
import Gun from 'gun/gun'
import createExec from 'gun-exec'
const gun = Gun();

let execute = createExec(gun, {
  logging: true
})

// equivalent to: gun.get('colors').put({color: 'blue'})
execute(gun, [{
  get: 'colors'
}, {
  put: {
    color: 'blue'
  }
}])

let cols = execute(gun, {
  get: 'colors'
})
// ...
```

Special options:
- `root: true` : resets the chain context to the gun instance.

Advanced example

```js
  let blue = execute(gun, [{
    get: 'kris'
  }, {
    put: {
      name: 'kris',
      role: 'developer'
    },
  }, {
    get: 'kris',
    root: true
  }, {
    val: cbEnd
  }], {
    logging: false
  })
```

Here we override the logging level of this `execute` context via `logging: false` as the final (optional) argument.

## Contributing

Install dependency modules/packages

`npm i`

![bad ass](https://github.com/kristianmandrup/gun-exec/raw/master/bad-ass.jpg)

### Compile/Build

The project includes a `gulpfile` configured to use Babel 6.
All `/src` files are compiled to `/dist` including source maps.

Scripts:

- start: `npm start`
- build: `npm run build` (ie. compile)
- watch and start: `npm run watch`
- watch and build: `npm run watch:b`

### Run Tests

`npm test` or simply `ava test`

## License

MIT Kristian Mandrup