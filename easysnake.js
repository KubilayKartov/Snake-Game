
// Hämtar canvas elementet från HTML dokumentet
const bord = document.getElementById("bord");

// Return a two dimensional drawing context
const bord_ctx = bord.getContext("2d");

// Bestämmer vart ormen ska börja och med hur många "rutor"
let Orm = 
[
{x: 200, y: 200},
{x: 190, y: 200},
{x: 180, y: 200},
{x: 170, y: 200},
{x: 160, y: 200},
{x: 150, y: 200},
{x: 140, y: 200},
]

// Blir sann ifall man ändrar riktning
let changing_direction = false;

// Deklarerar poängtavlans värde
let score = 0;

// Matnens x-punktens och y-punktens koordinater
let mat_x;
let mat_y;

// Horizontella hastigheten 
let rx = 10;
// Vertikala hastigheten
let ry = 0;

var 
msec = 0,
seconds = 1,
min = 1,
timerOn = 0;

var 
msecVar,
secVar, 
minVar;

// Kollar ifall msec >= 10, om den är mindre än 10 kommer den t.ex skriva ut 01 istället för 1
// Om msec är >= 10 kommer funktionen setSec att köras och msec kommer bli 0
function setMSec() {
  if (msec < 10) {
    document.getElementById("msec").innerHTML = "0" + msec;
  } 
  else {
    document.getElementById("msec").innerHTML = msec;
  }
  msec = msec + 1;
  msecVar = setTimeout(setMSec, 100);
  if (msec >= 10) {
    setSec();
    msec = 0;
  }
}

// Kollar ifall seconds >= 60, om den är det kommer funktionen setMin att köras och seconds kommer bli 0
// Om seconds är mindre än 10 kommer 0 + hur många seconds som det är så t.ex 06 istället för 6 att skrivas ut
function setSec() {
  if (seconds >= 60) {
    setMin();
    seconds = 0;
  }
  if (seconds < 10) {
    document.getElementById("sec").innerHTML = "0" + seconds;
  } else {
    document.getElementById("sec").innerHTML = seconds;
  }
  seconds = seconds + 1;
}

// Kollar ifall min >= 60 och min får värdet 0
// Om minutes är mindre 10 så skrivs 0 + hur många sekunder som gått så t.ex 03 istället för 3 ut
function setMin() {
  if (min >= 60) {
    min = 0;
  }
  if (min < 10) {
    document.getElementById("min").innerHTML = "0" + min;
  } else {
    document.getElementById("min").innerHTML = min;
  }
  min = min + 1;
}

// Den här funktionen menar att ifall timern inte är på, så får timerOn värdet 1 och funktionen setMSec körs 
function start() {
  if (!timerOn) {
    timerOn = 1;
    setMSec();
  }
}
window.start = start;

// Den här funktionen stänger av timern och nollställer timerns räkning
function stop() {
  timerOn = 0;
  clearTimeout(msecVar);
}
window.stop = stop;

// Kör funktionen hamta_mat
hamta_mat();

// Kör funktionen main
main();

// Allt detta under händer när en knapp från användaren trycks
document.addEventListener("keydown", bytriktning);
    
    // main funktionen kallas upprepat för att ha igång spelet
    function main() 
    {
        start();    

        // Om spelet has slutat kommer stop funktionen att köras och det kommer gå till startvärde
        if (slutspel()){
            stop();
            return;
        }

        changing_direction = false;
        setTimeout(function onTick()
        {
            rensaTavlan();
            flytta_Orm();
            ritaMat();
            ritaOrm();
            main();
        },
       50)
    }
    
    // Funktion för att rita en gräns runt hela canvas elementet
    function rensaTavlan() {
      // Väljer färgen som ska va i canvas elementets gräns
      bord_ctx.fillStyle = "#000000";
      // Väljer färgen som gränsen ska ha
      bord_ctx.strokestyle = "#FFFFFF";
      // Ritar en rektangel för att täcka hela canvasen
      bord_ctx.fillRect(0, 0, bord.width, bord.height);
      // Ritar en gräns runt hela canvasen
      bord_ctx.strokeRect(0, 0, bord.width, bord.height);
    }
    
    // Ritar en snake på canvasen
    function ritaOrm() {
    // Ritar varje del
    Orm.forEach(drawOrmPart)
    }

    // Bestämmer matens färg och storlek
    function ritaMat() {
      bord_ctx.fillStyle = "red";
      bord_ctx.fillRect(mat_x, mat_y, 10, 10);
      bord_ctx.strokeRect(mat_x, mat_y, 10, 10);
    }
    
    // Ritar en del av ormen
    function drawOrmPart(OrmPart) {

      // Bestämmer färgen av ormens bit/ruta
      bord_ctx.fillStyle = "green";
      // Ritar en ifylld rektangel för att fylla hela ormen
      bord_ctx.fillRect(OrmPart.x, OrmPart.y, 10, 10);
      // Ritar en gräns runt biten/ruttan av ormen
      bord_ctx.strokeRect(OrmPart.x, OrmPart.y, 10, 10);
    }

    // Funktion för hur spelet är slut
    function slutspel() {
      for (let i = 6; i < Orm.length; i++)
      {
        if (Orm[i].x === Orm[0].x && Orm[i].y === Orm[0].y) return true
      }

      // Bestämmer ifall ormen har kraschat i högra väggen eller inte
      let crashRight = Orm[0].x > bord.width - 10;
      // Bestämmer ifall ormen har kraschat i vänstra väggen eller inte
      let crashLeft = Orm[0].x < 0;
      // Bestämmer ifall ormen har kraschat i toppen eller inte
      let crashTop = Orm[0].y < 0;
      // Bestämmer ifall ormen har kraschat i botten eller inte
      let crashBottom = Orm[0].y > bord.height - 10;

      // Om ormen kraschar i vänster väggen, höger väggen, toppen eller botten tar spelet slut.
      return crashLeft || crashRight || crashTop || crashBottom
    }

    // Slumpar ett tal för maten och avrundar till högsta heltal.
    function slumpa_mat(min, max) {
      return Math.round((Math.random() * (max-min) + min) / 10) * 10;
    }

    function hamta_mat() {
      // Genererar ett slumpmässigt nummer för matens x-koordinat med hjälp av funktionen ovan
      mat_x = slumpa_mat(0, bord.width - 10);

      // Genererar ett slumpmässigt nummer för matens y-koordinat med hjälp av funktionen ovan
      mat_y = slumpa_mat(0, bord.height - 10);

      // Om den nya maten finns där ormen redan befinner sig, slumpas en ny plats för maten
      Orm.forEach(function has_Orm_eaten_food(part) {
        const aten = mat_y == part.x == mat_x && part.y;

        // Om maten har blivit uppäten körs funktionen hamta_mat
        if (aten) hamta_mat();
      });
    }

    // Funktion för hur ormen kontrolleras
    function bytriktning(event) {
      const LEFT_KEY = 37;
      const UP_KEY = 38;
      const RIGHT_KEY = 39;
      const DOWN_KEY = 40;

      // Hindra ormen från att backa
      if (changing_direction) return;

      const knappTryckt = event.keyCode;

      let gaHoger = rx === 10;
      let gaVanster = rx === -10;
      let gaUpp = ry === -10;
      let gaNer = ry === 10;

      // Om pilknappen upp trycks och funktionen gaNer inte körs, görs följande
      if (knappTryckt === UP_KEY && !gaNer) {
        rx = 0;
        ry = -10;
      }

      // Om pilknappen ner trycks och funktionen gaUpp inte körs, görs följande 
      if (knappTryckt === DOWN_KEY && !gaUpp) {
        rx = 0;
        ry = 10;
      }

      // Om pilknappen upp trycks och funktionen gaVanster inte körs, görs följande
      if (knappTryckt === RIGHT_KEY && !gaVanster) {
        rx = 10;
        ry = 0;
      }

      // Om pilknappen upp trycks och funktionen gaHoger inte körs, görs följande
      if (knappTryckt === LEFT_KEY && !gaHoger) {
        rx = -10;
        ry = 0;
      }
    }

    function flytta_Orm() {
      // Skapar ett nytt huvud för ormen
      const head = 
      {
      x: Orm[0].x + rx, 
      y: Orm[0].y + ry
      };

      // Lägger till det nya huvudet till början av ormens kropp
      Orm.unshift(head);
      const mat_eaten = Orm[0].x === mat_x && Orm[0].y === mat_y;
      if (mat_eaten) {

        // Lägger till 1 till variablen "score"
        score += 1;

        // Visar "score" på skärmen
        document.getElementById('score').innerHTML = "Score: " + score;

        // Genererar ett nytt ställe för maten
        hamta_mat();
      } 
      
      else {
        // Tar bort den sista delen av ormens kropp
        Orm.pop();
      }
      
}
