## Elm usage

*Resources*

- [Elm ports example](https://www.paramander.com/blog/using-ports-to-deal-with-files-in-elm-0-17)
- [Elm subscriptions](https://www.elm-tutorial.org/en/03-subs-cmds/01-subs.html)
- [Elm commands](https://www.elm-tutorial.org/en/03-subs-cmds/02-commands.html)
- [Elm decoder pipeline](https://github.com/NoRedInk/elm-decode-pipeline#examples)
- [Guide to JSON with Elm](https://medium.com/@zenitram.oiram/a-beginners-guide-to-json-and-elm-c4a0c7e20002)

*Out port*

```elm
-- send Gun commands over port
port gunCommander : GunExecCommand -> Cmd msg

-- parts of domain model that can be synced with Gun
type alias GunModel =
    User
  | Ship

type alias GunOp =
    { name : String
    , args : List String
    }

type alias GunMutation =
    { name : String
    , model : GunModel
    }

type alias GunCommand =
    GunMutation
  | GunOp

type alias GunExecCommand =
    List GunCommand
```

*In port*

```elm
-- Incoming JSON must be decoded
port gunEvents : (String -> msg) -> Sub msg

type alias Model =
  gunEvent : String

-- handle incoming gun data

type Msg =
  SetGunEvent String

initialModel =
  {
    gunEvent = ""
  }

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SetGunEvent event ->
            ( { model | gunEvent = event }, Cmd.none )

subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [
          gunEvents SetGunEvent
        ]

main : Program Float Model Msg
main =
    Html.programWithFlags
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
```

*HTML port publish/subscribe*

```html
<head>
  <script src="http://rawgit.com/amark/gun/master/gun.js"></script>
  <script src="http://rawgit.com/kristianmandrup/gun-exec/master/dist/gun-exec.js"></script>
  <script>
    var gun = Gun();
    var node = gun.get('color')

    var execute = createExec(gun, {logging: true})

    app.ports.gunCommander.subscribe(function (command) {
      console.log('gun command from elm', command)

      // for testing
      // node.put({
      //   red: 0,
      //   green: 0,
      //   blue: 70
      // })

      // execute command via gun-exec
      // execute(command)
    })

    node.on(function (data) {
      console.log('gun data - send to elm', command)
      // send as JSON
      app.ports.gunReceiver.send(data);
    })
</script>
</head>
```

### Json encode/decode

When you receive the Gun events as Strings, you likely want to Json decode into Elm model entities.

```elm
import Json.Decode exposing (int, string, float, nullable, Decoder)
import Json.Decode.Pipeline exposing (decode, required, optional, hardcoded)

type alias User =
  { id : Int
  , email : Maybe String
  , name : String
  }

userDecoder : Decoder User
userDecoder =
    decode User
        |> required "id" int
        |> required "email" (nullable string)
        |> optional "name" string "(unknwon)"

decodeUser : Result String User
decodeUser =
  Json.Decode.decodeString
    userDecoder
    """
      {"id": 123, "email": "sam@example.com", "name": "Sam Sample"}
    """

decodeUserEvent : Result String User
decodeUserEvent event =
    Json.Decode.decodeString
        userDecoder
        event

```

`decodeUser` takes a `Result` (of a command `Cmd`) as a `String` and converts it to a domain model `User`.

```elm
type Msg =
  SetGunEvent String

type alias Model =
  user : User

type alias User =
    { id : Int
    , email : Maybe String
    , name : String
    }

initialUser : User
initialUser =
    { id = 0
    , email = Nothing
    , name = ""
    }

initialModel : { user : User }
initialModel =
    { user = initialUser
    }

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
      -- ...
      SetGunEvent event ->
        ( { model | user = (decodeUserEvent event) }, Cmd.none )
```

Have a go with it ;)