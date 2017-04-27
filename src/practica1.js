/**
 * jshint strict: false
 * lobal console: false
 * exported ppal
 */

/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */
MemoryGame = function(gs) {

    this.gs = gs;
    //Array de cartas
    this.cartas = new Array("back", "8-ball", "potato", "dinosaur", "kronos", "rocket", "unicorn", "guy", "zeppelin");
    //Array que contiene el tablero con las cartas
    this.tablero = new Array();
    //Número de cartas encontradas, para saber cuando se termina. [0, 16]
    this.cartasEncontradas = 0;
    //Número de cartas que estan hacia arriba. [0,2] 
    this.cartasVolteadas = 0;
    //Estado del juego
    this.estado = "Memory Game";
    //Última carta volteada
    this.cartaAnterior;

};

MemoryGame.prototype = {
    //Inicializa el juego creando las cartas (recuerda que son 2 de
    //cada tipo de carta), desordenándolas y comenzando el bucle de juego.
    initGame: function() {
        var i;
        //Mete todas las cartas menos la primera, que es back, que es la que se muestra cuando estan boca abajo
        for (i = 1; i < this.cartas.length; i++) {
            this.tablero.push(new MemoryGameCard(this.cartas[i]));
            this.tablero.push(new MemoryGameCard(this.cartas[i]));
        }
        this.mezclarCartas();
        this.loop();
    },

    //Dibuja el juego, esto es: (1) escribe el mensaje con el estado actual
    //del juego y (2) pide a cada una de las cartas del tablero que se dibujen.
    draw: function() {
        var i;

        this.gs.drawMessage(this.estado);
        for (i = 0; i < this.tablero.length; i++) {
            this.tablero[i].draw(this.gs, i);
        }
    },

    //Es el bucle del juego. En este caso es muy sencillo: llamamos al
    //método draw cada 16ms (equivalente a unos 60fps). Esto se realizará con
    //la función setInterval de Javascript.
    loop: function() {
        var self = this;
        setInterval(function() {
            self.draw();
        }, 16);
    },

    //Este método se llama cada vez que el jugador pulsa
    //sobre alguna de las cartas (identificada por el número que ocupan en el
    //array de cartas del juego). Es el responsable de voltear la carta y, si hay
    //dos volteadas, comprobar si son la misma (en cuyo caso las marcará como
    //encontradas). En caso de no ser la misma las volverá a poner boca abajo
    onClick: function(cardId) {

        var self = this;
        if (this.esPosicionValida(cardId) && this.tablero[cardId].estado === "abajo" && this.cartasVolteadas < 2) {
            this.tablero[cardId].flip();
            this.cartasVolteadas++;
            if (this.cartasVolteadas === 1) {
                this.cartaAnterior = cardId;
            } else if (this.cartasVolteadas === 2) {
                if (this.tablero[this.cartaAnterior].compareTo(this.tablero[cardId])) {
                    this.tablero[cardId].found();
                    this.tablero[this.cartaAnterior].found();
                    this.cartasEncontradas += 2;
                    this.estado = this.esFinal() ? "You Win!!" : "Match found!!";
                    this.cartasVolteadas = 0;
                } else {
                    this.estado = "Try again";
                    setTimeout(function() {
                        self.cartasVolteadas = 0;
                        self.tablero[cardId].flip();
                        self.tablero[self.cartaAnterior].flip();
                    }, 500);
                }

            }
        }
    },

    esFinal: function() {
        return (this.cartasEncontradas === this.tablero.length);
    },

    mezclarCartas: function(){
    	this.tablero = this.tablero.sort(function() {return Math.random() - 0.5});
    },

    esPosicionValida: function(cardId){
    	return ((cardId >= 0) && (cardId < this.tablero.length) && (cardId !== null))
    }

};


/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
var MemoryGameCard = function(id) {

    //Sprite de la carta
    this.sprite = id;
    //Indica su estado: abajo, arriba, encontrada
    this.estado = "abajo";

};

MemoryGameCard.prototype = {
    //Da la vuelta a la carta, cambiando el estado de la misma
    flip: function() {
        this.estado = this.estado === "abajo" ? "arriba" : "abajo";
    },

    //Marca una carta como encontrada, cambiando el estado de la misma
    found: function() {
        this.estado = "encontrada";
    },

    //Compara dos cartas, devolviendo true si ambas representan la misma carta
    compareTo: function(otherCard) {
        return this.sprite === otherCard.sprite;
    },

    //Dibuja la carta de acuerdo al estado en el que se encuentra.
    //Recibe como parámetros el servidor gráfico y la posición en la que se
    //encuentra en el array de cartas del juego (necesario para dibujar una carta)
    draw: function(gs, pos) {
        (this.estado === "abajo") ? gs.draw("back", pos): gs.draw(this.sprite, pos);
    }
};