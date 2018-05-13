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
          VILLE.sekvens(this.start)
        }
      })
    })
    this.app = new PIXI.Application()
    document.body.appendChild(this.app.view)
  }

  VILLE.spel = {
    ladda: ladda,
    start: () => { }
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
  function ta_bort(objekt) {
    let _ta_bort = function* () {
      objekt.parent.removeChild(objekt)
    }
    VILLE.instruktion(_ta_bort)
  }
  VILLE.ta_bort = ta_bort
})();

(function () {
  let _hanteringar = []

  function instruktion(instruktion) {
    _hanteringar[_hanteringar.length - 1](instruktion)
    return instruktion
  }
  instruktion.hantera = (hantera, registrera_instruktioner) => {
    _hanteringar.push(hantera)
    registrera_instruktioner()
    _hanteringar.pop()
  }
  instruktion.finnsHantering = () => {
    return _hanteringar.length > 0
  }
  VILLE.instruktion = instruktion
})();

(function () {
  function sekvens(registrera_instruktioner) {
    let _instruktion, _flera_instruktioner = [], _upprepa = 1

    let _sekvens = function* () {
      for (let i = 0; i < _upprepa; i++) {
        for (let instruktion of _flera_instruktioner) {
          yield* instruktion()
        }
        yield
      }
    }
    _sekvens.upprepa = (upprepa) => {
      _upprepa = upprepa === undefined ? Number.MAX_SAFE_INTEGER : upprepa
      return _sekvens
    }

    if (VILLE.instruktion.finnsHantering()) {
      VILLE.instruktion(_sekvens)
    } else {
      VILLE.spel.app.ticker.add(() => {
        if (!_instruktion) {
          _instruktion = _sekvens()
        }
        _instruktion.next()
      })
    }
    VILLE.instruktion.hantera((instruktion) => {
      _flera_instruktioner.push(instruktion)
    }, registrera_instruktioner)

    return _sekvens
  }
  VILLE.sekvens = sekvens
})();

(function () {
  function parallellt(registrera_instruktioner) {
    let _flera_instruktioner = []

    let _parallellt = function* () {
      let _att_göra = _flera_instruktioner.slice()
      for (let i = 0; i < _att_göra.length; i++) {
        _att_göra[i] = _att_göra[i]()
      }
      while (_att_göra.length > 0) {
        for (let i = _att_göra.length - 1; i >= 0; i--) {
          let resultat = _att_göra[i].next()
          if (resultat && resultat.done) {
            _att_göra.splice(i, 1)
          }
        }
        yield
      }
    }
    VILLE.instruktion.hantera((instruktion) => {
      _flera_instruktioner.splice(0, 0, instruktion)
    }, registrera_instruktioner)

    return VILLE.instruktion(_parallellt)
  }
  VILLE.parallellt = parallellt
})();

(function () {
  function vänta(tid) {
    let _vänta = function* () {
      let passerad_tid = 0
      while (passerad_tid < tid) {
        passerad_tid += VILLE.spel.app.ticker.elapsedMS / 1000
        yield
      }
    }
    return VILLE.instruktion(_vänta)
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
  function flytta(objekt) {
    let _med = {}, _till = {}, _tid

    let _flytta = function* () {
      let { x = objekt.x, y = objekt.y } = _till
      if (_med.x || _med.y) {
        x = objekt.x + (_med.x || 0)
        y = objekt.y + (_med.y || 0)
      }
      let interpolera =
        VILLE.interpolera(objekt).till({ x: x, y: y }).tid(_tid)
      yield* interpolera()
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
    return VILLE.instruktion(_flytta)
  }
  VILLE.flytta = flytta
})();

(function () {
  const grader_till_radianer = (Math.PI * 2) / 360

  function rotera(objekt) {
    let _med, _till, _tid

    let _rotera = function* () {
      let rotation = objekt.rotation
      if (_med !== undefined) {
        rotation = objekt.rotation + _med * grader_till_radianer
      }
      if (_till !== undefined) {
        rotation = _till * grader_till_radianer
      }
      let interpolera =
        VILLE.interpolera(objekt).till({ rotation: rotation }).tid(_tid)
      yield* interpolera()
    }
    _rotera.med = (med) => {
      _till = undefined
      _med = med
      return _rotera
    }
    _rotera.till = (till) => {
      _med = undefined
      _till = till
      return _rotera
    }
    _rotera.tid = (tid) => {
      _tid = tid
      return _rotera
    }
    return VILLE.instruktion(_rotera)
  }
  VILLE.rotera = rotera
})();

(function () {
  function visa(objekt) {
    let _tid
    let _visa = function* () {
      yield* VILLE.interpolera(objekt).till({ alpha: 1 }).tid(_tid)()
    }
    _visa.tid = (tid) => {
      _tid = tid
      return _visa
    }
    return VILLE.instruktion(_visa)
  }
  VILLE.visa = visa
})();

(function () {
  function dölj(objekt) {
    let _tid
    let _dölj = function* () {
      yield* VILLE.interpolera(objekt).till({ alpha: 0 }).tid(_tid)()
    }
    _dölj.tid = (tid) => {
      _tid = tid
      return _dölj
    }
    return VILLE.instruktion(_dölj)
  }
  VILLE.dölj = dölj
})();

(function () {
  function knapp(knapp) {
    let _knapp = {}, _upprepa = false

    _knapp.upprepa = () => {
      _upprepa = true
      return _knapp
    }

    _knapp.ner = (registrera_instruktioner) => {
      let _sekvens

      document.addEventListener("keydown", (evt) => {
        if (evt.key.toLowerCase() === knapp.toLowerCase()) {
          if (_sekvens) {
            return
          }
          _sekvens = VILLE.sekvens(registrera_instruktioner)
          if (_upprepa) {
            _sekvens.upprepa()
          }
        }
      })
      document.addEventListener("keyup", (evt) => {
        if (evt.key.toLowerCase() === knapp.toLowerCase()) {
          _sekvens.upprepa(0)
          _sekvens = undefined
        }
      })
      return _knapp
    }
    return _knapp
  }
  VILLE.knapp = knapp
})();

// (function () {
//   function aabb(a, b) {
//     if (a.x + a.width < b.x) {
//       return false
//     }
//     if (a.x > b.x + b.width) {
//       return false
//     }
//     if (a.y > b.y + b.height) {
//       return false
//     }
//     if (a.y + a.height < b.y) {
//       return false
//     }
//     return true
//   }
//   function kollision(a, b) {
//     let _hantera
//     let _kollision = function* () {
//       while (true) {
//         if (aabb(a, b) && _hantera) {
//           VILLE.sekvens(() => {
//             _hantera()
//           })
//         }
//         yield
//       }
//     }
//     _kollision.hantera = (hantera) => {
//       _hantera = hantera
//       return _kollision
//     }
//     return VILLE.utför(_kollision)
//   }
//   VILLE.kollision = kollision
// })();