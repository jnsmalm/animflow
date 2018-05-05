/*MIT License

Copyright (c) 2018 Jens Malmborg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

const VILLE = {};

(function () {
  function ladda() {
    fetch("konfig.json").then((svar) => {
      return svar.json()
    }).then((konfig) => {
      Object.assign(spel, konfig)
      for (let namn in konfig.bilder) {
        PIXI.loader.add(namn, konfig.bilder[namn].url)
      }
      PIXI.loader.load(() => {
        if (this.start) {
          this.start()
        }
      })
    })
    this.app = new PIXI.Application({ width: 640, height: 480 })
    document.body.appendChild(this.app.view)
  }
  VILLE.spel = {
    start: () => { },
    ladda: ladda
  }
})();

(function () {
  const { spel } = VILLE

  function bild(namn) {
    let sprite = new PIXI.Sprite(PIXI.loader.resources[namn].texture)
    sprite.anchor.set(0.5)
    sprite.scale.set(spel.bilder[namn].skala)
    sprite.position.set(
      spel.app.renderer.width / 2, spel.app.renderer.height / 2)
    return spel.app.stage.addChild(sprite)
  }
  VILLE.bild = bild
})();

(function () {
  const { spel } = VILLE

  function utför(arbete) {
    arbete = arbete()
    spel.app.ticker.add(() => {
      let resultat = arbete.next()
      if (resultat && resultat.done) {
        return
      }
    })
  }
  VILLE.utför = utför
})();

(function () {
  function sekvens(...flera_arbeten) {
    return function* () {
      for (let arbete of flera_arbeten) {
        yield* arbete()
      }
    }
  }
  VILLE.sekvens = sekvens
})();

(function () {
  function upprepa(arbete) {
    let _antal = Number.MAX_SAFE_INTEGER
    let _upprepa = function* () {
      for (let i = 0; i < _antal; i++) {
        yield* arbete()
      }
    }
    _upprepa.antal = (antal) => {
      _antal = antal
      return _upprepa
    }
    return _upprepa
  }
  VILLE.upprepa = upprepa
})();

(function () {
  function parallellt(...flera_arbeten) {
    return function* () {
      let _flera_arbeten = flera_arbeten.slice()
      for (let i = 0; i < _flera_arbeten.length; i++) {
        _flera_arbeten[i] = _flera_arbeten[i]()
      }
      while (_flera_arbeten.length > 0) {
        for (let i = _flera_arbeten.length - 1; i >= 0; i--) {
          let resultat = _flera_arbeten[i].next()
          if (resultat && resultat.done) {
            _flera_arbeten.splice(i, 1)
          }
        }
        yield
      }
    }
  }
  VILLE.parallellt = parallellt
})();

(function () {
  const { spel } = VILLE

  function vänta(tid) {
    return function* () {
      let passerad_tid = 0
      while (passerad_tid < tid) {
        passerad_tid += spel.app.ticker.elapsedMS / 1000
        yield
      }
    }
  }
  VILLE.vänta = vänta
})();

(function () {
  function linjär_interpolation(a, b, t) {
    return a + (b - a) * t
  }
  function interpolera(objekt) {
    let _tid = 0, _till
    let _interpolera = function* () {
      let från = {}
      for (let namn in _till) {
        från[namn] = objekt[namn]
      }
      let passerad_tid = 0
      while (passerad_tid < _tid) {
        passerad_tid += spel.app.ticker.elapsedMS / 1000
        for (let namn in från) {
          objekt[namn] = linjär_interpolation(från[namn],
            _till[namn], Math.min(1, passerad_tid / _tid))
        }
        yield
      }
      for (let namn in från) {
        objekt[namn] = _till[namn]
      }
    }
    _interpolera.till = function (till) {
      _till = till
      return _interpolera
    }
    _interpolera.tid = (tid) => {
      _tid = tid
      return _interpolera
    }
    return _interpolera
  }
  VILLE.interpolera = interpolera
})();

(function () {
  let { interpolera } = VILLE

  function flytta(objekt) {
    let _med = {}, _till = {}, _tid
    let _flytta = function* () {
      let { x = objekt.x, y = objekt.y } = _till
      if (_med.x || _med.y) {
        x = objekt.x + (_med.x || 0)
        y = objekt.y + (_med.y || 0)
      }
      yield* interpolera(objekt).till({ x: x, y: y }).tid(_tid)()
    }
    _flytta.med = (med) => {
      Object.assign(_med, med)
      return _flytta
    }
    _flytta.till = (till) => {
      Object.assign(_till, till)
      return _flytta
    }
    _flytta.tid = (tid) => {
      _tid = tid
      return _flytta
    }
    return _flytta
  }
  VILLE.flytta = flytta
})();