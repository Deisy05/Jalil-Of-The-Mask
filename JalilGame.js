//Vamos a usar http://processingjs.org/
// o https://p5js.org/reference/

// Importamos las librerias si es necesario usar listas
const { append, cons, first, isEmpty, isList, length, rest } = functionalLight;

/**
 * Se definen los mundos
 * let, var, const namne = null; 
 * No requiere interacción con el usuario
 */
const FPS = 45; //veces que se actualiza el juego en 1 segundo
const MURO = 1;
const MONEDA = 2;
const BILLETE = 3;
const CORAZON = 4;
const CANVAS_WIDTH = 823;
const CANVAS_HEIGHT = 540;
const SIZE = 36;
const WIDTH = 23;
const HEIGHT = 15;
const MAPA = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 1, 2, 4, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 3, 1],
  [1, 1, 1, 2, 2, 2, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 3, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 2, 1],
  [1, 2, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 2, 1, 2, 1, 1, 1, 2, 1, 3, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 2, 1, 4, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
  [1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 4, 1, 2, 1],
  [1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

let muro = null;
let tomb = null; 
let lava = null;

function sketchProc(processing) {
  /**
   * Esto se llama antes de iniciar (espacio de trabajo)
   */
  processing.setup = function () {
    processing.frameRate(FPS);
    processing.size(CANVAS_WIDTH, CANVAS_HEIGHT);
    muro = processing.loadImage('images/muros.jpg');
    mone = processing.loadImage('images/mone.png');
    tomb = processing.loadImage('images/jalil.png');
    lava = processing.loadImage('images/LAVA.jpg');
    billete = processing.loadImage('images/billete.png');
    cora = processing.loadImage('images/cora.png');
    processing.state = {
      time: 0,
      tomb: { 
        x: 11, 
        y: 14, 
        alive: true,
        vidas: 1 
        },
      mapa: MAPA,
      puntaje: 0,
      lava: { 
        x: 0, 
        y: HEIGHT + 1}
    };
  };

// Dibuja algo en el canvas. Aqui se pone todo lo que quieras pintar
processing.drawGame = function (world) {
  processing.background(0, 0, 0);

  function recursiveList(l, f, index = 0) {
    if (!isEmpty(l)) {
      f(first(l), index);
      recursiveList(rest(l), f, index + 1)
    }
  }

  recursiveList(world.mapa, (row, i) => {
    recursiveList(row, (cell, j) => {
      if (cell == 1) {//es para los muros del laberinto
        // nombre de imagen, tamaño columna, tamaño fila, ancho maximo, largo maximo.
        processing.image(muro, j * SIZE, i * SIZE, SIZE, SIZE);
      }
      if (cell == 2) { //este es para monedas 
        //tamaño de la columna, tomaño de la fila, ancho, largo 
        processing.image(mone, j * SIZE + SIZE / 4, i * SIZE + SIZE / 4, SIZE / 2.5, SIZE / 2.5);
      }
      if (cell == 3) { //este es para billetes (super monedas) 
        //tamaño de la columna, tomaño de la fila, ancho, largo 
        processing.image(billete, j * SIZE + SIZE / 5.37, i * SIZE + SIZE / 4 , SIZE / 2.5, SIZE / 2.5);
      }
      if (cell == 4) { //este es para monedas 
        //tamaño de la columna, tomaño de la fila, ancho, largo 
        processing.image(cora, j * SIZE + SIZE / 4, i * SIZE + SIZE / 4, SIZE / 2.5, SIZE / 2.5);
      }
    });
  });


  if (world.time == 0)
    processing.image(tomb, world.tomb.x * SIZE, world.tomb.y * SIZE, SIZE, SIZE);
  else
    processing.image(tomb, world.tomb.x * SIZE, world.tomb.y * SIZE, SIZE, SIZE);
    processing.image(lava, world.lava.x * SIZE, world.lava.y * SIZE, SIZE * WIDTH, SIZE * HEIGHT);
}

//Función que funciona como (Make world, make tomb, etc)
function make(data, attribute) {
  return Object.assign({}, data, attribute);
}




//Funcion que actualiza la lava
function updateLava(world) {
  if (world.lava.y > 0) {
    world.lava.y -= SIZE / 2500; //Se demora más en subir la lava mientras mas grande sea el numero.
  }
}

//Funcion que actualiza las vidas
function updateVidas(world) {
  if (world.tomb.vidas <= 0 && world.tomb.alive==true) {
    world.tomb.alive = false; //Mata a tomb si las vidas bajan a 0.
  }
}

//Funcion que hace colision con la lava (ácido)
function colisionLava(world) {
  if (world.lava.y < (world.tomb.y + 0.95) && world.tomb.vidas>=2) {
    world.tomb.vidas = world.tomb.vidas-1;
    world.lava.y = 15;
    world.tomb.x = 11;
    world.tomb.y = 13;
    world.tomb.curDir = processing.UP;
  } else if (world.lava.y < (world.tomb.y + 0.95) && world.tomb.vidas<=1 && world.tomb.alive==true ) {
    world.tomb.vidas = world.tomb.vidas-1;
  }
}

//Función que hace colisiones
function colisionMuro(mapa, pos) {
  if ((pos.x >= 0 && pos.x < WIDTH) &&
    (pos.y >= 0 && pos.y < HEIGHT)) {
    var x1 = Math.floor(pos.x);
    var y1 = Math.floor(pos.y);
    var x2 = Math.ceil(pos.x);
    var y2 = Math.ceil(pos.y);
    return (mapa[y1][x1] == MURO || mapa[y2][x2] == MURO);
  }
  else {
    world.tomb.vidas -= 1;
  }
}

//Funcion que hace colisión con las monedas
function colisionMoneda(world) {
  var pos = { x: world.tomb.x, y: world.tomb.y };
  var x1 = Math.ceil(pos.x);
  var y1 = Math.ceil(pos.y);
  if (world.mapa[y1][x1] == MONEDA) {
    world.mapa[y1][x1] = 0;
    world.puntaje += 1;//se suma 1 punto cada vez que colisiona con 1 moneda
  }
}

//Funcion que hace colisión con los Billetes
function colisionBillete(world) {
  var pos = { x: world.tomb.x, y: world.tomb.y };
  var x1 = Math.ceil(pos.x);
  var y1 = Math.ceil(pos.y);
  if (world.mapa[y1][x1] == BILLETE) {
    world.mapa[y1][x1] = 0;
    world.puntaje += 10;//se suma 10 punto cada vez que colisiona con 1 billete
    if (world.lava.y >= 13) {
    world.lava.y = 15;
  } else if (world.lava.y < 13) {
    world.lava.y = world.lava.y/0.85;
  }
  }
}

//Funcion que hace colisión con los corazones
function colisionCorazon(world) {
  var pos = { x: world.tomb.x, y: world.tomb.y };
  var x1 = Math.ceil(pos.x);
  var y1 = Math.ceil(pos.y);
  if (world.mapa[y1][x1] == CORAZON) {
    world.mapa[y1][x1] = 0;
    world.tomb.vidas += 1;//se suma 1 vida cada vez que colisiona con 1 corazon
  }
}

// Función que actualiza a tomb
function updateTomb(world) {
  const step = SIZE / 144; //Hace que tomb por bloque de 144 pasos (1 bloque mide 36, entonces lo divide en 144) - Además con menor valor va mas rapido Jalil y con más pasos va más lento
  var pos = { x: world.tomb.x, y: world.tomb.y };
  
  switch (world.tomb.curDir) {
    case processing.LEFT:
      {
        pos.x -= step;
        if (!colisionMuro(world.mapa, pos)) {
          world.tomb.x -= step;
        }
        break;
      }
    case processing.RIGHT:
      {
        pos.x += step;
        if (!colisionMuro(world.mapa, pos)) {
          world.tomb.x += step;
        }
        break;
      }
    case processing.UP:
      {
        pos.y -= step;
        if (!colisionMuro(world.mapa, pos)) {
          world.tomb.y -= step;
        }
        break;
      }
    case processing.DOWN:
      {
        pos.y += step;
        if (!colisionMuro(world.mapa, pos)) {
          world.tomb.y += step;
        }
        break;
      }
    default:
      break;
  }
}



// Actualiza el mundo despues de cada frame. En este ejemplo, no cambia nada, solo retorna una copia del mundo
processing.onTic = function (world) {
if (world.tomb.alive && world.puntaje<250 && world.tomb.x == 11 && world.tomb.y == 14) {//Solo funciona si tomb está vivo y tiene menos de 200 puntos (o meta para ganar)
    updateTomb(world);
    var puntajeTexto = document.getElementById("puntaje");
    puntajeTexto.innerText = "Puntos: " + world.puntaje;
    var puntosRestantes = document.getElementById("restantes");
    puntosRestantes.innerText = "Puntos para ganar: " + (250 - world.puntaje);
    var vidasTexto = document.getElementById("vidas");
    vidasTexto.innerText = "Vidas: " + (world.tomb.vidas);
  }
  else if (world.tomb.alive && world.puntaje<250 && world.tomb.y <14) {//Solo funciona si tomb está vivo y tiene menos de 200 puntos (o meta para ganar)
    updateTomb(world);
    updateLava(world);
    updateVidas(world);
    colisionMoneda(world);
    colisionBillete(world);
    colisionLava(world);
    colisionCorazon(world);
    var puntajeTexto = document.getElementById("puntaje");
    puntajeTexto.innerText = "Puntos: " + world.puntaje;
    var puntosRestantes = document.getElementById("restantes");
    puntosRestantes.innerText = "Puntos para ganar: " + (250 - world.puntaje);
    var vidasTexto = document.getElementById("vidas");
    vidasTexto.innerText = "Vidas: " + (world.tomb.vidas);
  }
  else if (world.tomb.alive==true && world.puntaje>=250) {//Solo funciona si tomb está vivo y tiene más de 200 puntos (o la meta para ganar 
    world.tomb.alive = false;
    var puntajeTexto = document.getElementById("puntaje");
    puntajeTexto.innerText = "Felicitaciones, ¡Ganaste!";

    const winImage = document.getElementById("win-image")
    winImage.style.display = "inline";

    var puntosRestantes = document.getElementById("restantes");
    puntosRestantes.innerText = "Puntos: "+ world.puntaje;
    
  }
  else if (world.tomb.alive==false && world.puntaje<250){//aquí se puede poner algo con html para reiniciar el nivel.
    var puntajeTexto = document.getElementById("puntaje");
    puntajeTexto.innerText = "Perdiste, intentalo de nuevo";

    const gameOverImage = document.getElementById("game-over-image")
    gameOverImage.style.display = "inline";

    var puntosRestantes = document.getElementById("restantes");
    puntosRestantes.innerText = "Puntos: " + world.puntaje;
    var vidasTexto = document.getElementById("vidas");
    vidasTexto.innerText = "Vidas restantes: " + (world.tomb.vidas);
  }
  return make(world, {});
}


//Implemente esta función si quiere que su programa reaccione a eventos del teclado
processing.onKeyEvent = function (world, keycode) {
  //keycode
  const tolerancia = (SIZE / 144) * 2.1;
  if (keycode == processing.LEFT && world.tomb.curDir != processing.LEFT && world.tomb.y < (Math.round(world.tomb.y)+tolerancia) && world.tomb.y > (Math.round(world.tomb.y)-tolerancia)) {
    return make(world, { tomb: make(world.tomb, { 
      y: Math.round(world.tomb.y),
      curDir: processing.LEFT
      }) });
  }
  if (keycode == processing.RIGHT && world.tomb.curDir != processing.RIGHT && world.tomb.y < (Math.round(world.tomb.y)+tolerancia) && world.tomb.y > (Math.round(world.tomb.y)-tolerancia)) {
    return make(world, { tomb: make(world.tomb, { 
      y: Math.round(world.tomb.y),
      curDir: processing.RIGHT
      }) });
  }
  if (keycode == processing.UP && world.tomb.curDir != processing.UP && world.tomb.x < (Math.round(world.tomb.x)+tolerancia) && world.tomb.x > (Math.round(world.tomb.x)-tolerancia)) {
    return make(world, { tomb: make(world.tomb, { 
      x: Math.round(world.tomb.x),
      curDir: processing.UP
      }) });
  }
  if (keycode == processing.DOWN && world.tomb.curDir != processing.DOWN && world.tomb.x < (Math.round(world.tomb.x)+tolerancia) && world.tomb.x > (Math.round(world.tomb.x)-tolerancia)) {
    return make(world, { tomb: make(world.tomb, { 
      x: Math.round(world.tomb.x),
      curDir: processing.DOWN
      }) });
  }
  else
    return make(world, {});
}

// ******************** De aquí hacia abajo no debe cambiar nada. ********************

// Esta es la función que pinta todo. Se ejecuta n veces por segundo. 
// No cambie esta función. Su código debe ir en drawGame
processing.draw = function () {
  processing.drawGame(processing.state);
  processing.state = processing.onTic(processing.state);
};

// Esta función se ejecuta cada vez que presionamos una tecla. 
// No cambie esta función. Su código debe ir en onKeyEvent
processing.keyPressed = function () {
  processing.state = processing.onKeyEvent(processing.state, processing.keyCode);
}

// Esta función se ejecuta cada vez movemos el mouse. 
// No cambie esta función. Su código debe ir en onKeyEvent
processing.mouseMoved = function () {
  processing.state = processing.onMouseEvent(processing.state,
    { action: "move", mouseX: processing.mouseX, mouseY: processing.mouseY });
}

// Estas funciones controlan los eventos del mouse. 
// No cambie estas funciones. Su código debe ir en OnMouseEvent
processing.mouseClicked = function () {
  processing.state = processing.onMouseEvent(processing.state,
    { action: "click", mouseX: processing.mouseX, mouseY: processing.mouseY, mouseButton: processing.mouseButton });
}

processing.mouseDragged = function () {
  processing.state = processing.onMouseEvent(processing.state,
    { action: "drag", mouseX: processing.mouseX, mouseY: processing.mouseY, mouseButton: processing.mouseButton });
}

processing.mousePressed = function () {
  processing.state = processing.onMouseEvent(processing.state,
    { action: "press", mouseX: processing.mouseX, mouseY: processing.mouseY, mouseButton: processing.mouseButton });
}

processing.mouseReleased = function () {
  processing.state = processing.onMouseEvent(processing.state,
    { action: "release", mouseX: processing.mouseX, mouseY: processing.mouseY, mouseButton: processing.mouseButton });
}
    // Fin de los eventos del mouse
  }

var canvas = document.getElementById("canvas");

// Adjuntamos nuestro sketch al framework de processing
var processingInstance = new Processing(canvas, sketchProc); 

window.addEventListener("load",canvas.focus())