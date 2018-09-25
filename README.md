# Ville.js

JavaScript library for creating animations and smaller games. It uses a 
command-based approach where each command waits (by default) for the previous
command to complete. This makes the flow of the application easy to understand
and simple to change.

*A simple example for an application that shows a sprite of mario which rotates
360 degrees in one second and than waits one second until repeating the sequence.*

```javascript
const { game, sprite, repeat, rotate, wait } = VILLE

game.init()

game.load(() => {
  let mario = sprite("assets/mario.png")
  repeat(() => {
    rotate(mario).by(360).time(1).ease()
    wait(1)
  })
})
```

## Getting started

There are two methods for getting started: one that contains a starter structure
ready to go, and one for just for using Ville.js as a library.

### Using a starter structure

This requires that you have [Node.js](http://nodejs.org) already installed on
your machine.

* Download the starter structure from GitHub:
  - git: `git clone https://github.com/jnsmalm/villejs-template.git`
  - zip: [download](https://github.com/jnsmalm/villejs-template/archive/master.zip)
  and unpack to the folder of your choice.
* Open the terminal and browse to that same folder and type `npm install`.
* Also type `npm run start` which will start a local web server and open your
default web browser. If everything works you should see an image of super mario.

### Using just the library

* Download [Ville.js](https://github.com/jnsmalm/villejs/releases/latest)
* Add to webpage with `<script type="text/javascript" src="ville.js"></script>`
* Also add PIXI.js (rendering engine used by Ville.js) `<script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.7.1/pixi.min.js"></script>`