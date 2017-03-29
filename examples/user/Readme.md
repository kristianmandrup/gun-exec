# Elm User port example

Attempt to create a simple example for integrating Elm and Gun.js via ports.

## App

The main elm program

```elm
main : Program Float Model Msg
main =
    Html.programWithFlags
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
```

### AppModel

The Application model

### Init

Initialize models

### CommandPort

Port to communicate with the outside world (ie JavaScript runtime)

```elm
port gunCommander : GunExecCommand -> Cmd msg

type alias GunCommand a =
    { name : String
    , args : List a
    }


type alias GunExecCommand =
    List GunCommand String
```

## Event ports

Incoming event port (subscriptions)

- `User`
- `String`

### UserEventPort

port for translating an event to a `User`

### StrEventPort

port for translating an event to a `String`

### UserDecoder

JSON decoder pipeline to decode a `String` to a `User`

## Status

WIP
