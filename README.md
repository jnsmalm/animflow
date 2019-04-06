# Animflow

JavaScript library for creating animations and smaller games. It uses a 
command-based approach where each command waits (by default) for the previous
command to complete. This makes the flow of the application easy to understand
and simple to change.

## Getting started

Start by downloading the latest version of [Animflow](https://github.com/jnsmalm/animflow/releases/latest) 
and [PIXI.js](https://github.com/pixijs/pixi.js/releases/latest) (the rendering 
engine used by Animflow).

Create a file `index.html` with the following contents.

```html
<!doctype html>
<html lang="en">
<head>
  <script src="pixi.js"></script>
  <script src="animflow.js"></script>
</head>
<body>
  <script src="game.js"></script>
</body>
</html>
```

Create another file `game.js`. Also download an image of your choice, for example 
an image of [mario](https://www.google.com/search?q=mario+png&source=lnms&tbm=isch&sa=X&ved=0ahUKEwj0hfvpprvhAhWs5KYKHSk7DXEQ_AUIDigB&biw=1033&bih=540&dpr=2).

```javascript
const { game, sprite, repeat, move, ease, wait } = ANIMFLOW

game.init()

game.load(() => {
  let mario = sprite("mario.png")
  repeat(() => {
    move(mario).by({ y: -150 }).time(0.2).ease(ease.sine_out)
    move(mario).by({ y: +150 }).time(0.2).ease(ease.sine_in)
    wait(1)
  })
})
```

Open `index.html` with your web browser and you should see mario jumping.

### Install with NPM

If you are using tools such as Webpack or Browserify you may want to install 
Animflow as a node module. Animflow is not yet available in npm registry but can 
instead be installed directly from the git repo.

`npm install git+https://git@github.com/jnsmalm/animflow.git --save`

### Starter Kit

This requires that you have [Node.js](http://nodejs.org) already installed on
your machine.

* Download the Starter Kit from GitHub:
  - git: `git clone https://github.com/jnsmalm/animflow-starter-kit.git`
  - zip: [download](https://github.com/jnsmalm/animflow-starter-kit/archive/master.zip)
  and unpack to the folder of your choice.
* Open the terminal and browse to that same folder and type `npm install`.
* Also type `npm start` which will start a local web server and open your
default web browser. If everything works you should see an image of mario.

## Building

`npm start` will build to `dist` using development settings. It will also start 
a local webserver at the root for making it easier to test while developing. 
Create a `index.html` file in root and include the scripts.

`npm run build` will build to `dist` using production settings.

## Documentation

### Overview

Animflow is built around a command-based API where each command waits (by 
default) for the previous command to complete. This makes it really simple to 
instruct your application to do things that requires multiple animation frames 
to complete. For example, the code below makes an object move in a shape of a 
rectangle:

```javascript
move(object).by({ x: +100 }).time(1)
move(object).by({ y: +100 }).time(1)
move(object).by({ x: -100 }).time(1)
move(object).by({ y: -100 }).time(1)
```
Each of the `move` commands will wait until the previous command has completed. 
The `time` function instructs the `move` function how many seconds it should 
take for the object to move.

### Tasks and task runners

A `task` is the building stone of almost all other commands (e.g. `move`, 
`wait` and `sequence`). Every `task` is created using a generator 
function. The code below creates a task which moves an object on the x-axis:

```javascript
task(function*() {
  for (let i = 0; i < 100; i++) {
    object.x++
    yield
  }
})
```
Each time the generator function uses `yield`, it will "pause" the task until 
the next animation frame. The command above will therefore take 100 frames to
complete.

A `task` can't run on it's own, it needs a task runner to do that. A task runner 
is used to step through the generator function. There are two built in task 
runners: `sequence` and `parallel`. As the names suggests, one is used for 
running the tasks in sequence, while the other one runs the tasks in parallel.

*First shows the object, then moves the object.*

```javascript
sequence(() => {
  show(object).time(1)
  move(object).by({ x: +100 }).time(1)
})
```
*Shows and moves the object at the same time.*

```javascript
parallel(() => {
  show(object).time(1)
  move(object).by({ x: +100 }).time(1)
})
```
The `sequence` and `parallel` tasks can also be combined within each other to
handle a more complex senario. Let's say that we have multiple objects that we
want to show and then move, but all objects should do it at the same time.

```javascript
parallel(() => {
  for (let i = 0; i < objects.length; i++) {
    sequence(() => {
      show(objects[i]).time(1)
      move(objects[i]).by({ x: +100 }).time(1)
    })
  }
})
```