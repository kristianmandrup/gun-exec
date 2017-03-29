port module UserEventPort exposing (gunEvents)

import AppModel exposing (User)


port gunEvents : (User -> msg) -> Sub msg
