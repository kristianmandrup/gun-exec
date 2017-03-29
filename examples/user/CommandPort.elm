port module CommandPort exposing (..)

import UserModel exposing (User)


-- send Gun commands over port


port gunCommander : GunExecCommand -> Cmd msg



-- parts of domain model that can be synced with Gun


type alias GunModel =
    User


type alias GunCommand a =
    { name : String
    , args : List a
    }


type alias GunExecCommand =
    List GunCommand String
