module App exposing (..)

import Html exposing (..)
import AppModel exposing (Model)
import Init exposing (..)
import UserEventPort exposing (gunEvents)


init =
    initialModel


view : Model -> Html Msg
view model =
    div [] [ text model.user ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SetGunEvent user ->
            ( { model | user = user }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ gunEvents SetGunEvent
        ]


main : Program Float Model Msg
main =
    Html.programWithFlags
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
