module Init exposing (..)

import AppModel exposing (Model, User)


initialUser : User
initialUser =
    { id = 0
    , email = Nothing
    , name = ""
    }


initialModel : Model
initialModel =
    { user = initialUser
    , gunUser = initialUser
    , name = ""
    }
