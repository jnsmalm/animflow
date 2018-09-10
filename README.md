# Ville.js

A JavaScript library for creating animations and smaller games. It has been 
designed for being easy to use and simple for getting started.

## Getting started

1. [Download Node.js](http://nodejs.org) which is a program for executing 
JavaScript code.
2. [Download Ville.js](https://github.com/jnsmalm/villejs/archive/master.zip) 
by clicking the link or by using git: `git clone https://github.com/jnsmalm/villejs.git`.
Unpack the archive to a folder of your choice.
3. Open the terminal and browse to the same folder as in step 2 and type 
`npm install`.
4. Also type `npm run start` which will start the default program and open your 
default web browser. If everything works you should see an image of super mario.
5. Let's change the code! Open the file `game.js` with a texteditor and replace 
the contents with the following:

```
const { game, sprite, key, move, ease } = VILLE

game.init()

game.load(() => {
  let mario = sprite("mario")
  key(" ").down(() => {
    move(mario).by({ y: -100 }).time(0.2).ease(ease.sine_out)
    move(mario).by({ y: +100 }).time(0.2).ease(ease.sine_in)
  })
})
```

If you didn't close the browser window it will refresh automatically and you 
should be able to make super mario to jump by pressing the space key.