# chat application

* create a chatroom - DONE
* people remain anonymous ; make your own name
* create chatrooms with invite link
* upload and share images from the chatroom (maybe host somewhere else like imgur)
<!-- * end goal: e2e encryption -->

## todo

* ~~send message on Enter key press~~ complete!
* ~~same username can't join twice~~ complete!
* ~~scroll to bottom on every new message~~ complete!
* need to figure out broken css build tool

## system design

| client |    | client |    | client | (react.js) (html/css)
     v             v            v
        ------------------------
                    |
                    |
                | server | (node.js) (ws)

### dependencies

* websockets/ws (https://github.com/websockets/ws)