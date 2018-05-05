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