module AppModel exposing (..)


type alias Model =
    { gunUser : User
    , user : User
    }


type alias User =
    { id : Int
    , email : Maybe String
    , name : String
    }
