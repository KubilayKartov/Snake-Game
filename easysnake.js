
// H�mtar canvas elementet fr�n HTML dokumentet
const bord = document.getElementById("bord");

// Return a two dimensional drawing context
const bord_ctx = bord.getContext("2d");

// Best�mmer vart ormen ska b�rja och med hur m�nga "rutor"
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

// Blir sann ifall man �ndrar riktning
let changing_direction = false;

// Deklarerar po�ngtavlans v�rde
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

// Kollar ifall msec >= 10, om den �r mindre �n 10 kommer den t.ex skriva ut 01 ist�llet f�r 1
// Om msec �r >= 10 kommer funktionen setSec att k�ras och msec kommer bli 0
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

// Kollar ifall seconds >= 60, om den �r det kommer funktionen setMin att k�ras och seconds kommer bli 0
// Om seconds �r mindre �n 10 kommer 0 + hur m�nga seconds som det �r s� t.ex 06 ist�llet f�r 6 att skrivas ut
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

// Kollar ifall min >= 60 och min f�r v�rdet 0
// Om minutes �r mindre 10 s� skrivs 0 + hur m�nga sekunder som g�tt s� t.ex 03 ist�llet f�r 3 ut
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

// Den h�r funktionen menar att ifall timern inte �r p�, s� f�r timerOn v�rdet 1 och funktionen setMSec k�rs 
function start() {
  if (!timerOn) {
    timerOn = 1;
    setMSec();
  }
}
window.start = start;

// Den h�r funktionen st�nger av timern och nollst�ller timerns r�kning
function stop() {
  timerOn = 0;
  clearTimeout(msecVar);
}
window.stop = stop;

// K�r funktionen hamta_mat
hamta_mat();

// K�r funktionen main
main();

// Allt detta under h�nder n�r en knapp fr�n anv�ndaren trycks
document.addEventListener("keydown", bytriktning);
    
    // main funktionen kallas upprepat f�r att ha ig�ng spelet
    function main() 
    {
        start();    

        // Om spelet has slutat kommer stop funktionen att k�ras och det kommer g� till startv�rde
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
    
    // Funktion f�r att rita en gr�ns runt hela canvas elementet
    function rensaTavlan() {
      // V�ljer f�rgen som ska va i canvas elementets gr�ns
      bord_ctx.fillStyle = "#000000";
      // V�ljer f�rgen som gr�nsen ska ha
      bord_ctx.strokestyle = "#FFFFFF";
      // Ritar en rektangel f�r att t�cka hela canvasen
      bord_ctx.fillRect(0, 0, bord.width, bord.height);
      // Ritar en gr�ns runt hela canvasen
      bord_ctx.strokeRect(0, 0, bord.width, bord.height);
    }
    
    // Ritar en snake p� canvasen
    function ritaOrm() {
    // Ritar varje del
    Orm.forEach(drawOrmPart)
    }

    // Best�mmer matens f�rg och storlek
    function ritaMat() {
      bord_ctx.fillStyle = "red";
      bord_ctx.fillRect(mat_x, mat_y, 10, 10);
      bord_ctx.strokeRect(mat_x, mat_y, 10, 10);
    }
    
    // Ritar en del av ormen
    function drawOrmPart(OrmPart) {

      // Best�mmer f�rgen av ormens bit/ruta
      bord_ctx.fillStyle = "green";
      // Ritar en ifylld rektangel f�r att fylla hela ormen
      bord_ctx.fillRect(OrmPart.x, OrmPart.y, 10, 10);
      // Ritar en gr�ns runt biten/ruttan av ormen
      bord_ctx.strokeRect(OrmPart.x, OrmPart.y, 10, 10);
    }

    // Funktion f�r hur spelet �r slut
    function slutspel() {
      for (let i = 6; i < Orm.length; i++)
      {
        if (Orm[i].x === Orm[0].x && Orm[i].y === Orm[0].y) return true
      }

      // Best�mmer ifall ormen har kraschat i h�gra v�ggen eller inte
      let crashRight = Orm[0].x > bord.width - 10;
      // Best�mmer ifall ormen har kraschat i v�nstra v�ggen eller inte
      let crashLeft = Orm[0].x < 0;
      // Best�mmer ifall ormen har kraschat i toppen eller inte
      let crashTop = Orm[0].y < 0;
      // Best�mmer ifall ormen har kraschat i botten eller inte
      let crashBottom = Orm[0].y > bord.height - 10;

      // Om ormen kraschar i v�nster v�ggen, h�ger v�ggen, toppen eller botten tar spelet slut.
      return crashLeft || crashRight || crashTop || crashBottom
    }

    // Slumpar ett tal f�r maten och avrundar till h�gsta heltal.
    function slumpa_mat(min, max) {
      return Math.round((Math.random() * (max-min) + min) / 10) * 10;
    }

    function hamta_mat() {
      // Genererar ett slumpm�ssigt nummer f�r matens x-koordinat med hj�lp av funktionen ovan
      mat_x = slumpa_mat(0, bord.width - 10);

      // Genererar ett slumpm�ssigt nummer f�r matens y-koordinat med hj�lp av funktionen ovan
      mat_y = slumpa_mat(0, bord.height - 10);

      // Om den nya maten finns d�r ormen redan befinner sig, slumpas en ny plats f�r maten
      Orm.forEach(function has_Orm_eaten_food(part) {
        const aten = mat_y == part.x == mat_x && part.y;

        // Om maten har blivit upp�ten k�rs funktionen hamta_mat
        if (aten) hamta_mat();
      });
    }

    // Funktion f�r hur ormen kontrolleras
    function bytriktning(event) {
      const LEFT_KEY = 37;
      const UP_KEY = 38;
      const RIGHT_KEY = 39;
      const DOWN_KEY = 40;

      // Hindra ormen fr�n att backa
      if (changing_direction) return;

      const knappTryckt = event.keyCode;

      let gaHoger = rx === 10;
      let gaVanster = rx === -10;
      let gaUpp = ry === -10;
      let gaNer = ry === 10;

      // Om pilknappen upp trycks och funktionen gaNer inte k�rs, g�rs f�ljande
      if (knappTryckt === UP_KEY && !gaNer) {
        rx = 0;
        ry = -10;
      }

      // Om pilknappen ner trycks och funktionen gaUpp inte k�rs, g�rs f�ljande 
      if (knappTryckt === DOWN_KEY && !gaUpp) {
        rx = 0;
        ry = 10;
      }

      // Om pilknappen upp trycks och funktionen gaVanster inte k�rs, g�rs f�ljande
      if (knappTryckt === RIGHT_KEY && !gaVanster) {
        rx = 10;
        ry = 0;
      }

      // Om pilknappen upp trycks och funktionen gaHoger inte k�rs, g�rs f�ljande
      if (knappTryckt === LEFT_KEY && !gaHoger) {
        rx = -10;
        ry = 0;
      }
    }

    function flytta_Orm() {
      // Skapar ett nytt huvud f�r ormen
      const head = 
      {
      x: Orm[0].x + rx, 
      y: Orm[0].y + ry
      };

      // L�gger till det nya huvudet till b�rjan av ormens kropp
      Orm.unshift(head);
      const mat_eaten = Orm[0].x === mat_x && Orm[0].y === mat_y;
      if (mat_eaten) {

        // L�gger till 1 till variablen "score"
        score += 1;

        // Visar "score" p� sk�rmen
        document.getElementById('score').innerHTML = "Score: " + score;

        // Genererar ett nytt st�lle f�r maten
        hamta_mat();
      } 
      
      else {
        // Tar bort den sista delen av ormens kropp
        Orm.pop();
      }
      
}
