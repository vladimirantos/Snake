function draw(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}
;

var canvas = document.getElementById("canvas"),
context = canvas.getContext("2d");
var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;
var dx = 0;
var dy = 0;
var touchLenght = 0;
var angle = 0;
var direction = null,
        game = {
            width: null,
            height: null,
            cellSize: canvas.width / 100,
            score: 0,
            end: null,
            fps: null,
            level: 1,
            message: "Stiskni enter pro spuštění hry",
            barrier: [],
            isStarted: false,
            start: function () {
                this.width = canvas.width;
                this.height = canvas.height;
                this.end = false;
                this.fps = 12;
                this.score = 0;
                this.level = 1;
                this.barrier = [];
                snake.init();
                food.create();
                //this.initBarrier();
                game.message = "Aktuální úroveň: " + game.level;
            },
            stop: function () {
                this.end = true;
                this.message = "Prohrál jsi. Dosáhl jsi " + this.level + " úrovně. Tvůj výsledek je: " + this.score;
            },
            reset: function () {
                context.clearRect(0, 0, this.width, this.height);
            },
            drawScore: function () {
                context.fillStyle = '#bbb';
                context.font = '15px Segoe UI, sans-serif';
                context.textAlign = 'right';
                context.fillText("Skóre: " + this.score, canvas.width - 30, canvas.height - 20);
            },
            drawMessage: function () {
                context.fillStyle = '#bbb';
                context.font = '15px Segoe UI, sans-serif';
                context.textAlign = 'left';
                context.fillText(this.message, 30, canvas.height - 20);
            },
            nextLevel: function () {
                this.fps = this.fps + 2;
                this.level++;
            },
//    initBarrier: function () {
//        var sx = Math.floor(Math.random() * this.width);
//        var sy = Math.floor(Math.random() * this.height);
//        var size = 10;//Math.floor(Math.random() * 10) + 1;
//        this.barrier.push({x: sx, y: sy});        
//        var x = sx;
//        var y = sy;
//        var shift = 0;
//        for (var i = 0; i < size; i++) {
//            var direction = Math.floor(Math.random() * 4) + 1;
//            if (direction == 1) //doleva
//                x = sx - i*snake.size;
//            if (direction == 2) //doprava
//                x = sx + i*snake.size;
//            if (direction == 3) //nahoru
//                y = sy - i*snake.size;
//            if (direction == 4)
//                y = sy + i*snake.size;
//
//            x = Math.ceil(x);
//            y = Math.ceil(y);
//            
//            if (this.check(x, y))
//                this.barrier.push({x: x, y: sy});
//            else
//                i--;
//            shift = (i + 1) / 2;
//            //console.log("d: "+direction, "x: "+x, "y: "+y, "ok: "+this.check(x,y), "i: "+i);  
//        }
//        //console.log("size:"+this.barrier.length);
//    },
//    drawBarrier: function () {
//        for (var i = 0; i < this.barrier.length; i++)
//        {
//            var b = this.barrier[i];
//            draw(b.x, b.y, snake.size, snake.size, 'white');
//        }
//    },
            check: function (x, y) {
                if (x <= 0 || x >= game.width || y <= 0 || y >= game.height)
                    return false;
                return true;
            }
        },
snake = {
    color: '#32CD32',
    cells: [],
    size: 0,
    startSize: 4,
    direction: null,
    //start position
    x: null,
    y: null,
    init: function () {
        this.size = game.width / 50;
        this.x = game.width / 2;
        this.y = game.height / 2;
        this.cells = [];
        this.direction = 'left';
        var shift = 0;
        for (var i = 0; i < this.startSize; i++) {
            this.cells.push({x: this.x + i * this.size + shift, y: this.y});
            shift = (i + 1) / 2;
        }
    },
    draw: function () {
        draw(this.cells[0].x, this.cells[0].y, this.size, this.size, '#7cfc00');
        for (var i = 1; i < this.cells.length; i++) {
            var cell = this.cells[i];
            if (i % 2 == 0)
                draw(cell.x, cell.y, this.size, this.size, '#008000');
            else
                draw(cell.x, cell.y, this.size, this.size, '#006400');
        }
    },
    move: function () {
        if (this.direction == null || game.isStarted == false)
            return;
        if (this.direction == 'left')
            this.x -= this.size + 0.5;
        else if (this.direction == 'right')
            this.x += this.size + 0.5;
        else if (this.direction == 'up')
            this.y -= this.size + 0.5;
        else if (this.direction == 'down')
            this.y += this.size + 0.5;
        this.cells.unshift({x: this.x, y: this.y});
        this.cells.pop();
        this.check();
        this.growth();
    },
    check: function () {
        if (this.isCollision(this.x, this.y) === true)
            game.stop();
    },
    isCollision: function (x1, y1) {
        if (x1 <= 0 || x1 >= game.width || y1 <= 0 || y1 >= game.height)
            return true;

        var data = this.cells.slice();
        var head = data[0];
        data.shift();
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (item.x == x1 && item.y == y1)
                return true;
        }
        return false;
    },
    growth: function () {
        if (this.x == food.x && this.y == food.y) {
            if (food.color == 'blue')
                game.score = game.score + 2;
            else
                game.score++;

            if (food.color == 'red')
                game.fps++;

            snake.cells.push({x: this.x, y: this.y});
            food.create();
            if (game.score % 2 == 0) {
                game.nextLevel();
                game.message = "Aktuální úroveň: " + game.level;
            }
        }
    }
},
//zlutý normal
//modry 2x skore
//cerveny zrychleni
food = {
    size: null,
    x: null,
    y: null,
    types: ['yellow', 'blue', 'red'],
    color: null,
    create: function () {
        this.size = snake.size;
        this.x = Math.ceil(Math.random() * 10) * (snake.size + 0.5) * 5 - (snake.size + 0.5) * 3;
        this.y = Math.ceil(Math.random() * 10) * (snake.size + 0.5) * 5 - (snake.size + 0.5) * 3;
        this.color = this.getType();
    },
    getType: function () {
        if (game.level < 2) {
            index = 0;
            return this.types[index];
        }
        var rand = Math.floor(Math.random() * 100);
        var index = 0;
        if (rand < 87)
            index = 0;
        if (rand >= 87 && rand < 93)
            index = 1;
        if (rand >= 93)
            index = 2;
        return this.types[index];
    },
    draw: function () {
        draw(this.x, this.y, this.size, this.size, this.color);
    }
},
inverseDirection = {
    'up': 'down',
    'left': 'right',
    'right': 'left',
    'down': 'up'
},
keys = {
    37: ['left'],
    38: ['up'],
    39: ['right'],
    40: ['down'],
    13: ['start']
};

addEventListener("keydown", function (e) {
    key = keys[e.keyCode];
    if ((key != null && key != 'start') && key != inverseDirection[snake.direction]) {
        snake.direction = key;
        game.isStarted = true;
    } else if (key == 'start' || game.end)
        game.start();
}, false);


canvas.addEventListener("touchstart", touchStart);
canvas.addEventListener("touchmove", touchMove);
canvas.addEventListener("touchend", touchEnd);

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 0);
            };
})();

window.cancelAnimationFrame = (function () {
    return window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.msCancelAnimationFrame ||
            function (intervalKey) {
                window.clearTimeout(intervalKey);
            };
})();


function touchStart(event) {
    event.preventDefault();
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;
}
;

function touchMove(event) {
    // event.preventDefault();
    endX = event.touches[0].pageX;
    endY = event.touches[0].pageY;
}
;

function touchEnd(event) {
    //  event.preventDefault();
    touchLength = Math.round(Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)));
    getAngle();
    getDirection();
}
;

function getAngle() {
    var x = startX - endX;
    var y = endY - startY;
    distance = Math.round(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    angle = Math.atan2(x, y); //úhel v radiánech (atan protože jsme v kartézském systému)
    angle = Math.round(angle * 180 / Math.PI);
    if (angle < 0) {
        angle = 360 - Math.abs(angle);
    }
}
;
function getDirection() {
    if ((angle >= 0) && (angle <= 45)) {
        direction = 'down';
    } else if ((angle >= 315) && (angle <= 360)) {
        direction = 'down';
    } else if ((angle >= 135) && (angle <= 225)) {
        direction = 'up';
    } else if ((angle > 45) && (angle < 135)) {
        direction = 'left';
    } else {
        direction = 'right';
    }
    key = direction;
    if ((key != null && key != 'start') && key != inverseDirection[snake.direction]) {
        snake.direction = key;
        game.isStarted = true;
    } else if (key == 'start' || game.end)
        game.start();
}
;
//doleva - dolu, doprava - nahoru, nahoru - doprava, dolu - doleva


function loop() {
    if (game.end === false) {
        game.reset();
        //game.drawBarrier();
        snake.move();
        food.draw();
        snake.draw();
        game.drawScore();
        game.drawMessage();
    } else {
        game.drawMessage("Prohrál jsi. Pro novou hru stiskni enter");
    }
    setTimeout(function () {
        requestAnimationFrame(loop);
    }, 1000 / game.fps);
}
;
requestAnimationFrame(loop);