port module StrEventPort exposing (gunEvents)


port gunEvents : (String -> msg) -> Sub msg


type alias Model =
    { gunEvent : String
    }



-- handle incoming gun data


type Msg
    = SetGunEvent String


initialModel : { gunEvent : String }
initialModel =
    { gunEvent = ""
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SetGunEvent event ->
            ( { model | gunEvent = event }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ gunEvents SetGunEvent
        ]
