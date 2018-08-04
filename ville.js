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

  class Spel {
    constructor() {
      this.app = new PIXI.Application()
      this.bredd = 1280
      this.höjd = 720
    }
    ladda() {
      fetch("konfig.json").then((svar) => {
        return svar.json()
      }).then((konfig) => {
        Object.assign(spel, konfig)
        for (let namn in konfig.bilder) {
          PIXI.loader.add(namn, konfig.bilder[namn].url)
        }
        PIXI.loader.load(() => {
          VILLE.sekvens(this.start)
        })
      })
      document.body.appendChild(this.app.view)
    }
    start() {
      // Skrivs över av användaren
    }
    storlek(bredd, höjd) {
      this.bredd = bredd
      this.höjd = höjd
      this.app.renderer.resize(bredd, höjd)
    }
    fyll_ut() {
      window.onresize = () => {
        this.app.renderer.resize(window.innerWidth, window.innerHeight)
        let scale = Math.min(
          window.innerWidth / this.bredd,
          window.innerHeight / this.höjd
        )
        this.app.stage.position.set(
          window.innerWidth / 2 - this.bredd * scale / 2,
          window.innerHeight / 2 - this.höjd * scale / 2
        )
        this.app.stage.scale.set(scale)
      }
      window.onresize()
    }
  }

  VILLE.spel = new Spel()
})();

(function () {
  const { spel } = VILLE

  VILLE.bild = (namn) => {
    let objekt = new PIXI.Sprite(PIXI.loader.resources[namn].texture)
    objekt.anchor.set(0.5)
    objekt.scale.set(spel.bilder[namn].skala)
    objekt.position.set(spel.bredd / 2, spel.höjd / 2)

    VILLE.instruktion(function* () {
      VILLE.spel.app.stage.addChild(objekt)
    })
    return objekt
  }
})();

(function () {
  const { spel } = VILLE

  VILLE.text = (text) => {
    let objekt = new PIXI.Text(text, {
      fontFamily: "Helvetica", fontSize: 36, fill: 0xffffff, align: "center"
    });
    objekt.anchor.set(0.5)
    objekt.position.set(spel.bredd / 2, spel.höjd / 2)

    VILLE.instruktion(function* () {
      VILLE.spel.app.stage.addChild(objekt)
    })
    return objekt
  }
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

  class Sekvens {
    constructor() {
      this._avbryt = false
      this._upprepa = 1
      this._färdig = false
    }
    färdig() {
      return this._färdig
    }
    upprepa(antal = Number.MAX_VALUE) {
      this._upprepa = antal
      return this
    }
    vänta() {
      let self = this
      VILLE.instruktion(function* () {
        while (!self._färdig) {
          yield
        }
      })
    }
    avbryt() {
      let self = this
      VILLE.instruktion(function* () {
        self._avbryt = true
      })
    }
  }

  let utförare = []

  function starta(exekvera, registrera_instruktioner) {
    let sekvens = new Sekvens()
    if (utförare.length > 0) {
      VILLE.instruktion(function* () {
        yield* exekvera(sekvens, registrera_instruktioner)
      })
    } else {
      let exekvering = exekvera(sekvens, registrera_instruktioner)
      let tick = () => {
        if (exekvering.next().done) {
          VILLE.spel.app.ticker.remove(tick)
        }
      }
      VILLE.spel.app.ticker.add(tick)
    }
    return sekvens
  }

  function* sekvens(sekvens, registrera_instruktioner) {
    for (let i = 0; i < sekvens._upprepa; i++) {
      let instruktioner = hämta_instruktioner(
        registrera_instruktioner
      )
      for (let instruktion of instruktioner) {
        for (let steg of instruktion()) {
          if (sekvens._avbryt) {
            sekvens._färdig = true
            return
          }
          yield
        }
      }
      yield
    }
    sekvens._färdig = true
  }

  function* parallellt(sekvens, registrera_instruktioner) {
    for (let i = 0; i < sekvens._upprepa; i++) {
      let instruktioner = hämta_instruktioner(
        registrera_instruktioner
      )
      instruktioner.reverse()
      for (let i = 0; i < instruktioner.length; i++) {
        instruktioner[i] = instruktioner[i]()
      }
      while (instruktioner.length > 0) {
        for (let i = instruktioner.length - 1; i >= 0; i--) {
          if (sekvens._avbryt) {
            sekvens._färdig = true
            return
          }
          if (instruktioner[i].next().done) {
            instruktioner.splice(i, 1)
          }
        }
        yield
      }
    }
    sekvens._färdig = true
  }

  function hämta_instruktioner(registrera_instruktioner) {
    let instruktioner = []
    utförare.push({
      lägg_till: (instruktion) => {
        instruktioner.push(instruktion)
      }
    })
    registrera_instruktioner()
    utförare.pop()
    return instruktioner
  }

  VILLE.sekvens = (registrera_instruktioner) => {
    return starta(sekvens, registrera_instruktioner)
  }

  VILLE.parallellt = (registrera_instruktioner) => {
    return starta(parallellt, registrera_instruktioner)
  }

  VILLE.fortsätt = (registrera_instruktioner) => {
    let exekvera = function* () {
      let instruktioner = hämta_instruktioner(registrera_instruktioner)
      for (let instruktion of instruktioner) {
        yield* instruktion()
      }
    }
    VILLE.instruktion(function* () {
      let exekvering = exekvera()
      let tick = () => {
        if (exekvering.next().done) {
          VILLE.spel.app.ticker.remove(tick)
        }
      }
      VILLE.spel.app.ticker.add(tick)
    })
  }

  VILLE.instruktion = (instruktion) => {
    utförare[utförare.length - 1].lägg_till(instruktion)
    return instruktion
  }

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
    let _med, _till, _tid

    let _flytta = function* () {
      let interpolera
      if (_till) {
        interpolera = VILLE.interpolera(objekt).till(_till).tid(_tid)
      } else {
        if (_med.x) {
          _med.x += objekt.x
        }
        if (_med.y) {
          _med.y += objekt.y
        }
        interpolera = VILLE.interpolera(objekt).till(_med).tid(_tid)
      }
      yield* interpolera()
    }
    _flytta.med = (med) => {
      _med = {}
      if (med.x !== undefined) {
        _med.x = med.x
      }
      if (med.y !== undefined) {
        _med.y = med.y
      }
      return _flytta
    }
    _flytta.till = (till) => {
      _till = {}
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

  class KnappSekvens {
    constructor(registrera_instruktioner) {
      this.registrera_instruktioner = registrera_instruktioner
    }
    utför() {
      if (this.sekvens && !this.sekvens.färdig()) {
        return
      }
      this.sekvens = VILLE.sekvens(this.registrera_instruktioner)
    }
  }

  class Knapphanterare {
    constructor() {
      this.ner = {}
      this.upp = {}
    }
    lägg_till_ner(knapp, knapp_sekvens) {
      knapp = knapp.toLowerCase()
      if (!this.ner[knapp]) {
        this.ner[knapp] = []
      }
      this.ner[knapp].push(knapp_sekvens)
    }
    lägg_till_upp(knapp, knapp_sekvens) {
      knapp = knapp.toLowerCase()
      if (!this.upp[knapp]) {
        this.upp[knapp] = []
      }
      this.upp[knapp].push(knapp_sekvens)
    }
    ta_bort_ner(knapp) {
      knapp = knapp.toLowerCase()
      if (!this.ner[knapp]) {
        return
      }
      this.ner[knapp].pop()
    }
    ta_bort_upp(knapp) {
      knapp = knapp.toLowerCase()
      if (!this.upp[knapp]) {
        return
      }
      this.upp[knapp].pop()
    }
    knapp_upp(knapp) {
      knapp = knapp.toLowerCase()
      if (!this.upp[knapp] || this.upp[knapp].length === 0) {
        return
      }
      this.upp[knapp].slice(-1)[0].utför()
    }
    knapp_ner(knapp) {
      knapp = knapp.toLowerCase()
      if (!this.ner[knapp] || this.ner[knapp].length === 0) {
        return
      }
      this.ner[knapp].slice(-1)[0].utför()
    }
  }

  class Knapp {
    constructor(knapp) {
      this.knapp = knapp
    }
    ner(registrera_instruktioner) {
      let self = this
      VILLE.instruktion(function* () {
        hanterare.lägg_till_ner(
          self.knapp, new KnappSekvens(registrera_instruktioner))
      })
      return new KnappNer(this.knapp)
    }
    upp(registrera_instruktioner) {
      let self = this
      VILLE.instruktion(function* () {
        hanterare.lägg_till_upp(
          self.knapp, new KnappSekvens(registrera_instruktioner))
      })
      return new KnappUpp(this.knapp)
    }
  }

  class KnappNer {
    constructor(knapp) {
      this.knapp = knapp
    }
    ignorera() {
      let self = this
      VILLE.instruktion(function* () {
        hanterare.ta_bort_ner(self.knapp)
      })
    }
  }

  class KnappUpp {
    constructor(knapp) {
      this.knapp = knapp
    }
    ignorera() {
      let self = this
      VILLE.instruktion(function* () {
        hanterare.ta_bort_upp(self.knapp)
      })
    }
  }

  let hanterare = new Knapphanterare()

  document.addEventListener("keyup", (evt) => {
    hanterare.knapp_upp(evt.key)
  })
  document.addEventListener("keydown", (evt) => {
    hanterare.knapp_ner(evt.key)
  })

  VILLE.knapp = (knapp) => {
    return new Knapp(knapp)
  }

})();

(function () {
  VILLE.ljud = (sökväg) => {
    let _klar = false
    let _ljud = function* () {
      let audio = new Audio(sökväg)
      audio.onended = () => {
        _klar = true
      }
      audio.play()
    }
    _ljud.vänta = () => {
      if (_klar) {
        return
      }
      VILLE.instruktion(function* () {
        while (!_klar) {
          yield
        }
      })
    }
    return VILLE.instruktion(_ljud)
  }
})();