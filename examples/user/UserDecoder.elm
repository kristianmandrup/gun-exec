module UserDecoder exposing (..)

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


decodeUserEvent : String -> Result String User
decodeUserEvent event =
    Json.Decode.decodeString
        userDecoder
        event
