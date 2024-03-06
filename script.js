import { Queue } from "./Queue.js";
const queue = new Queue();
const GRID_WIDTH = 40;
const GRID_HEIGHT = 30;
let direction = 'right';
let currentApple;
let point = 0;


document.addEventListener('DOMContentLoaded', start)

// CONTROLLER
function start() {
    createModel();
    currentApple = generateApple();
    document.addEventListener('keydown', keyPress)
    document.addEventListener('keyup', keyUp)
    createSnake();
    tick();
    
}

function restart() {
    location.reload();
}

function tick() {
    const delay = 100 - point * 5;
    setTimeout(tick, delay > 50 ? delay : 50);
   
    let head = queue.peek();
    let tail = {};

    while(head) {
        writeToCell(head.row, head.col, 1);
        tail = head;
        head = head.next;
    }

    if (controls.right) {
        direction = 'right';
    } else if (controls.left) {
        direction = 'left';
    } else if (controls.up) {
        direction = 'up';
    } else if (controls.down) {
        direction = 'down';
    }

    let newTail = {
        row: tail.row,
        col: tail.col
    };

    switch (direction) {
        case 'left':
            newTail.col--
            if(newTail.col < 0) {
                newTail.col = GRID_WIDTH - 1
            }
            break;
        case 'right':
            newTail.col++;
            if(newTail.col > GRID_WIDTH - 1) {
                newTail.col = 0;
            }
            break;
        case 'up':
            newTail.row--
            if(newTail.row < 0) {
                newTail.row = GRID_HEIGHT - 1
            }
            break;
        case 'down':
            newTail.row++;
            if(newTail.row > GRID_HEIGHT - 1) {
                newTail.row = 0;
            }
            break;
    }

    queue.enqueue(newTail);

    head = queue.peek()
    writeToCell(head.row,head.col,0)

    queue.dequeue();

    let newHead = queue.peek()

    while(newHead) {
        writeToCell(newHead.row, newHead.col, 1);
        newHead = newHead.next
    }

    
    let currentSnake = newTail;
    while (currentSnake && currentSnake.prev) {
        currentSnake = currentSnake.prev;
        if (currentSnake.row === newTail.row && currentSnake.col === newTail.col) {
            gameOver()
        }
    }
    
  
    if (readFromCell(newTail.row, newTail.col) === readFromCell(currentApple.row, currentApple.col)) {
        //after apple cell
        const afterAppleCell = {
            row: newTail.row,
            col: newTail.col
        }
        if(direction === 'right') {
            afterAppleCell.col = newTail.col + 1
        } else if(direction === 'left') {
            afterAppleCell.col = newTail.col - 1
        } else if(direction === 'up') {
            afterAppleCell.row = newTail.row - 1
        } else if(direction === 'down') {
            afterAppleCell.row = newTail.row + 1
        }
        writeToCell(afterAppleCell.row, afterAppleCell.col, 1);
        queue.enqueue(afterAppleCell);
        currentApple = generateApple();
        incrementPoint()
    }

    drawGame();
}

// VIEW
function drawGame() {
    const grid = document.getElementById('grid')
    grid.style.setProperty("--GRID_WIDTH", GRID_WIDTH);
    grid.innerHTML = '';

    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            const value = readFromCell[row,col]
            cell.textContent = value
            grid.appendChild(cell);

            switch(readFromCell(row, col)) {
                case 0:
                    cell.innerHTML = ''
                    break;
                case 1:
                    cell.innerHTML = '🐍'
                    break;
                case 2:
                    cell.innerHTML = "🍎"
                    break;
            }
        }
    }
}

function keyUp(event) {
    if(event.key === 'w') {
      controls.up = false;
    } else if(event.key === 's') {
      controls.down = false;
    } else if(event.key === 'a') {
      controls.left = false;
    } else if(event.key === 'd'){
      controls.right = false;
    }
  }
  
function keyPress(event) {
    if(event.key === 'w' && direction != 'down') {
      controls.up = true;
    } else if(event.key === 's' && direction != 'up') {
      controls.down = true;
    } else if(event.key === 'a' && direction != 'right') {
      controls.left = true;
    } else if(event.key === 'd' && direction != 'left'){
      controls.right = true;
    }
  }
  
  const controls = {
    left: false,
    right: false,
    up: false,
    down: false
  }

  function gameOver() {
    alert('Loser')
    restart()
  }


function incrementPoint() {
    point += 1
    const pointText = document.getElementById('point')
    pointText.textContent = ""
    pointText.textContent = `Point: ${point}`
}


// MODEL
const model = []

function createSnake() {
    const tail = {
        row: Math.floor(GRID_HEIGHT / 2),
        col: 21,
    }
    const mid = {
        row: Math.floor(GRID_HEIGHT / 2),
        col: 20,
    }
    const head = {
        row: Math.floor(GRID_HEIGHT / 2),
        col: 19,
    }

    queue.enqueue(head)
    queue.enqueue(mid)
    queue.enqueue(tail)

}

function createModel() {
    for(let row = 0; row < GRID_HEIGHT; row++) {
        const newRow = []
        for(let col = 0; col < GRID_WIDTH; col++) {
            newRow[col] = 0;
        }
        model[row] = newRow
    }

}

function writeToCell(row, col, value) {
    model[row][col] = value;
}

function readFromCell(row, col) {
    return model[row][col];
}

function generateApple() {
    let apple;
    do {
        apple = {
            row: Math.floor(Math.random() * GRID_HEIGHT),
            col: Math.floor(Math.random() * GRID_WIDTH)
        };
    } while (readFromCell(apple.row, apple.col) !== 0);

    writeToCell(apple.row, apple.col, 2);
    return apple;
}




