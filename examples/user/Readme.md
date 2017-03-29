# Elm User port example

Attempt to create a simple example for integrating Elm and Gun.js via ports.
Please see [Elm javascript interop guide](https://guide.elm-lang.org/interop/javascript.html)

## Online experimentation

You can also experiment using [Ellie - online Elm editor/IDE](https://www.humblespark.com/ellie-announcement/)

## Main

The `Main.elm` program

```elm
main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
```

### AppModel

The Application model

```
type alias Model =
    { gunUser : User -- incoming
    , user : User -- initial user?
    }

type alias User =
    { id : Int
    , email : Maybe String
    , name : String
    }
```

### Init

Initialize models

## Ports

### Outgoing Command port

We create a `check` port. On the Elm side, we can create commands like `check "badger"`, resulting in a `Cmd msg` that sends strings to the JS side.

```elm
-- port for sending strings out to JavaScript
port check : String -> Cmd msg
```

### Incoming subscription port

We create a `suggestions` port. This one looks a bit fancier than the check port, but imagine that it is creating `Sub (List String)`. You are essentially subscribing to lists of strings sent into Elm from JS. You provide a function from `(List String -> msg)` so you can convert that list of strings to your `Msg` type immediately. This makes it easy to deal with in your update function, but it is just for convenience. The real point is to send a `List String` from JS into Elm.

```elm
-- port for listening for suggestions from JavaScript
port suggestions : (List String -> msg) -> Sub msg
```

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

## The flow

The view contains an input `name` with an event handler `onInput` which triggers a `Name` msg.



```elm
, input
    [ value "", type_ "text", onInput Name ]
    []
```

The Name message is dispatched to `update` in order to update the application model and cause any side effects (via Commands). We update the `name` of the local app model and call `submitName` with the name as the side effect command.

```elm
update msg model =
    case msg of
        -- typed new name in input
        Name name ->
            ( { model | name = name }, submitName name )
```

`submitName` executes a `gunCommand` (see `CommandPort` module) with a new command created through `createCommand`

```elm
submitName : String -> Cmd msg
submitName name =
    gunCommand (createCommand name)
```

`createCommand` packages the new name inside a List of Records, with the name of the Gun command `put`
and the model to send over, built via `buildModel`

```elm
createCommand : String -> CommandPort.GunExecCommand
createCommand name =
    [ { name = "put"
      , model = buildModel name
      }
    ]
```

`buildModel` simply packages the model as a valid User model, with empty `id` and `email`

```elm
buildModel : String -> List User
buildModel name =
    [ { id = 0
      , name = name
      , email = Nothing
      }
    ]
```

## Passing model to command

We could also pass on the model directly to be converted to a Command.
Ideally `user` would be a nested record that we update:

See [updating nested records in elm](https://medium.com/elm-shorts/updating-nested-records-in-elm-15d162e80480)

```elm
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
    -- typed new name in input
    Name name ->
        ( { model | name = name }, submitModel model )


createCommand : Model -> CommandPort.GunExecCommand
createCommand model =
    [ { name = "put"
      , model = buildModel model
      }
    ]

buildModel : Model -> List User
buildModel model =
    [ { id = 0
      , name = model.name
      , email = Nothing
      }
    ]
```

### Final solution

In the final solution we update the `user` entry on the model and send the `model` or `model.user`
to be converted to an (update) command to be sent to Gun (the service) for execution.

```elm
parseId : String -> Int
parseId id =
    Result.withDefault 0 (String.toInt id)


setId : String -> User -> User
setId newId user =
    { user | id = parseId newId }


setName : String -> User -> User
setName newName user =
    { user | name = newName }


setEmail : String -> User -> User
setEmail newEmail user =
    { user | email = Just newEmail }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        -- retrieve new user from port
        SetGunEvent user ->
            ( { model | user = user }, Cmd.none )

        Id id ->
            ( { model | user = setId id model.user }, submitModel model )

        Name name ->
            ( { model | user = setName name model.user }, submitModel model )

        Email email ->
            ( { model | user = setEmail email model.user }, submitModel model )
```