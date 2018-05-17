# Ville.js

Spelramverk för nybörjare som lär sig programmera. Det är utvecklat för att 
vara enkelt att komma igång och att med ett fåtal lättförstådda funktioner 
kunna skapa små spel.

## Komma igång

1. [Ladda ner Node.js](http://nodejs.org) som är ett program som kan exekvera 
JavaScript kod.
2. [Ladda ner Ville.js](https://github.com/jnsmalm/villejs/archive/master.zip) 
genom att klicka på länken eller att använda git: `git clone https://github.com/jnsmalm/villejs.git`.
3. Öppna terminalen och gå till den katalog där du valt att ladda ner Ville.js 
och skriv `npm install`.
4. Skriv sedan `npm run start` som startar programmet och öppnar en webbläsare. 
Om allting fungerar ska du se en bild på super mario.
5. Få super mario att hoppa (med mellanslag) genom att öppna filen `spel.js` i 
en texteditor och ersätt allt innehåll med följande kod:

```
const { spel, bild, knapp, flytta } = VILLE

spel.ladda()

spel.start = () => {
  let mario = bild("mario")
  knapp(" ").ner(() => {
    flytta(mario).till({y: -100}).tid(0.2)
    flytta(mario).till({y: 0}).tid(0.2)
  })
}
```