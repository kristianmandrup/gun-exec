port module CommandPort exposing (..)

import AppModel exposing (User)


-- send Gun commands over port


port gunCommand : GunExecCommand -> Cmd msg



-- parts of domain model that can be synced with Gun


type alias GunModel =
    User


type alias GunCommand =
    { name : String
    , model : List User
    }


type alias GunExecCommand =
    List GunCommand
