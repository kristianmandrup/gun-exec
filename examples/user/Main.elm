module Main exposing (..)

import Html exposing (Html, program, div, button, input, text)
import Html.Attributes exposing (class, value, type_)
import Html.Events exposing (onInput)
import String


-- import Html.Events exposing (onClick)

import AppModel exposing (Model, User)
import Init exposing (initialModel)
import UserEventPort exposing (gunEvents)
import CommandPort exposing (gunCommand)


type Msg
    = SetGunEvent User
    | Id String
    | Name String
    | Email String


init : ( Model, Cmd Msg )
init =
    ( initialModel, Cmd.none )


buildModel : User -> List User
buildModel user =
    [ user
    ]


createCommand : User -> CommandPort.GunExecCommand
createCommand user =
    [ { name = "put"
      , model = buildModel user
      }
    ]


submitNewUser : User -> Cmd msg
submitNewUser user =
    gunCommand (createCommand user)


emailValue : Maybe String -> String
emailValue email =
    case email of
        Just email ->
            email

        Nothing ->
            ""


view : Model -> Html Msg
view model =
    div []
        [ div [ class "user" ]
            [ text "User" ]
        , input
            [ value (toString model.user.id), type_ "text", onInput Id ]
            []
        , input
            [ value model.user.name, type_ "text", onInput Name ]
            []
        , input
            [ value (emailValue model.user.email), type_ "text", onInput Email ]
            []
        ]


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
            ( { model | user = setId id model.user }, submitNewUser model.user )

        Name name ->
            ( { model | user = setName name model.user }, submitNewUser model.user )

        Email email ->
            ( { model | user = setEmail email model.user }, submitNewUser model.user )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ gunEvents SetGunEvent
        ]


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
