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
    let objekt = new PIXI.Sprite(PIXI.loader.resources[namn].texture)
    objekt.anchor.set(0.5)
    objekt.scale.set(spel.bilder[namn].skala)
    objekt.position.set(
      spel.app.renderer.width / 2, spel.app.renderer.height / 2)

    VILLE.instruktion(function* () {
      VILLE.spel.app.stage.addChild(objekt)
    })
    return objekt
  }
  VILLE.bild = bild
})();

(function () {
  function text(text) {
    let objekt = new PIXI.Text(text, {
      fontFamily: "Helvetica", fontSize: 36, fill: 0xffffff, align: "center"
    });
    objekt.anchor.set(0.5)
    objekt.position.set(
      VILLE.spel.app.renderer.width / 2, VILLE.spel.app.renderer.height / 2)

    VILLE.instruktion(function* () {
      VILLE.spel.app.stage.addChild(objekt)
    })
    return objekt
  }
  VILLE.text = text
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
    let _instruktion, _upprepa = 1

    let _sekvens = function* () {
      for (let i = 0; i < _upprepa; i++) {
        let _flera_instruktioner = []

        VILLE.instruktion.hantera((instruktion) => {
          _flera_instruktioner.push(instruktion)
        }, registrera_instruktioner)
        
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
    return _sekvens
  }
  VILLE.sekvens = sekvens
})();

(function () {
  function parallellt(registrera_instruktioner) {
    let _flera_instruktioner = []

    let _parallellt = function* () {
      VILLE.instruktion.hantera((instruktion) => {
        _flera_instruktioner.splice(0, 0, instruktion)
      }, registrera_instruktioner)

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
    return VILLE.instruktion(_parallellt)
  }
  VILLE.parallellt = parallellt
})();

(function () {
  function vänta(tid = Number.MAX_VALUE) {
    let _fortsätt = false
    VILLE.instruktion(function* () {
      let passerad_tid = 0
      while (passerad_tid < tid && !_fortsätt) {
        passerad_tid += VILLE.spel.app.ticker.elapsedMS / 1000
        yield
      }
    })
    let _vänta = {}
    _vänta.fortsätt = () => {
      VILLE.instruktion(function* () {
        _fortsätt = true
      })
    }
    return _vänta
  }
  VILLE.vänta = vänta
})();

(function () {
  VILLE.fortsätt = (registrera_instruktioner) => {
    let _fortsätt = function* () {
      let _flera_instruktioner = []
      VILLE.instruktion.hantera((instruktion) => {
        _flera_instruktioner.push(instruktion)
      }, registrera_instruktioner)

      for (let instruktion of _flera_instruktioner) {
        yield* instruktion()
      }
    }
    VILLE.instruktion(function* () {
      let _instruktion = _fortsätt()
      let _tick = () => {
        if (_instruktion.next().done) {
          VILLE.spel.app.ticker.remove(_tick)
        }
      }
      VILLE.spel.app.ticker.add(_tick)
    })
  }
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
      if (med.x !== undefined) {
        _med.x = med.x
      }
      if (med.y !== undefined) {
        _med.y = med.y
      }
      return _flytta
    }
    _flytta.till = (till) => {
      if (till.x !== undefined) {
        _till.x = till.x
      }
      if (till.y !== undefined) {
        _till.y = till.y
      }
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
  function skala(objekt) {
    let _med = {}, _till = {}, _tid

    let _skala = function* () {
      let { x = objekt.scale.x, y = objekt.scale.y } = _till
      if (_med.x || _med.y) {
        x = objekt.scale.x + (_med.x || 0)
        y = objekt.scale.y + (_med.y || 0)
      }
      let interpolera =
        VILLE.interpolera(objekt.scale).till({ x: x, y: y }).tid(_tid)
      yield* interpolera()
    }
    _skala.med = (med) => {
      if (typeof med === "number") {
        _med.x = med
        _med.y = med
      } else {
        if (med.x !== undefined) {
          _med.x = med.x
        }
        if (med.y !== undefined) {
          _med.y = med.y
        }
      }
      return _skala
    }
    _skala.till = (till) => {
      if (typeof till === "number") {
        _till.x = till
        _till.y = till
      } else {
        if (till.x !== undefined) {
          _till.x = till.x
        }
        if (till.y !== undefined) {
          _till.y = till.y
        }
      }
      return _skala
    }
    _skala.tid = (tid) => {
      _tid = tid
      return _skala
    }
    return VILLE.instruktion(_skala)
  }
  VILLE.skala = skala
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
  let _knappar = {}, _knapp_låsningar = {}

  document.addEventListener("keydown", (evt) => {
    let knapp = evt.key.toLowerCase()
    if (!_knappar[knapp] || _knappar[knapp].length === 0) {
      return
    }
    // Anropa keydown på det sista elementet i listan
    _knappar[knapp].slice(-1)[0].keydown()
  })

  document.addEventListener("keyup", (evt) => {
    let knapp = evt.key.toLowerCase()
    if (!_knappar[knapp] || _knappar[knapp].length === 0) {
      return
    }
    // Anropa keyup på det sista elementet i listan
    _knappar[knapp].slice(-1)[0].keyup()
  })

  VILLE.knapp = (knapp) => {
    if (!_knappar[knapp]) {
      _knappar[knapp] = []
    }
    _knapp = {}
    _knapp.ignorera = () => {
      // Lås denna knapp för knapptryckningar i väntan på registrering.
      _knapp_låsningar[knapp] = true
      VILLE.instruktion(function* () {
        _knappar[knapp].pop()
        // Den nya knappfunktionen har registrerats, släpp på låset.
        _knapp_låsningar[knapp] = false
      })
    }
    _knapp.ner = (registrera_instruktioner) => {
      // Lås denna knapp för knapptryckningar i väntan på registrering.
      _knapp_låsningar[knapp] = true

      let _funktion = {
        keydown: function () {
          // Om knappen är låst, strunta i det.
          if (_funktion.sekvens || _knapp_låsningar[knapp]) {
            return
          }
          _funktion.sekvens = VILLE.sekvens(registrera_instruktioner)
          if (_funktion.upprepa) {
            _funktion.sekvens.upprepa()
          }
        },
        keyup: function () {
          if (!_funktion.sekvens) {
            return
          }
          _funktion.sekvens.upprepa(0)
          _funktion.sekvens = undefined
        }
      }
      VILLE.instruktion(function* () {
        _knappar[knapp].push(_funktion)
        // Den nya knappfunktionen har registrerats, släpp på låset.
        _knapp_låsningar[knapp] = false
      })
      let _ner = {}
      _ner.upprepa = () => {
        _funktion.upprepa = true
      }
      return _ner
    }
    return _knapp
  }
})();