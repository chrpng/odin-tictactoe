const Player = (mark) => {
    let wins = 0;
    const getMark = () => mark;
    const getWins = () => wins;

    const incWins = () => {
        wins += 1;
    };
    
    return { getMark, getWins, incWins };
};

const gameBoard = (() => {
    let turnCount = 1;
    const players = [Player('X'), Player('O')];
    const gameArray = Array(9).fill(null);

    const add = (index, value) => {
        gameArray[index] = value;
    }

    const clear = () => {
        gameArray.fill(null);
    }

    const getGameArray = () => gameArray;

    const getTurnCount = () => turnCount;
    const incTurnCount = () => {
        turnCount += 1;
    };
    const resetTurnCount = () => {
        turnCount = 1;
    }

    const getCurrentPlayer = () => {
        return turnCount % 2 === 1 ? players[0] : players[1];
    }

    const getPlayers = () => players;

    const isWin = () => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        let winPattern = null;
        const isWin = winPatterns.some((pattern) => {
            const test = gameArray[pattern[0]]
                      && gameArray[pattern[0]] === gameArray[pattern[1]]
                      && gameArray[pattern[0]] === gameArray[pattern[2]];
            if(test) { winPattern = pattern }
            return test;
        });
        if(isWin) {
            return { isWin, winPattern };
        } else {
            return { isWin, winPattern: null };
        }
    };

    const isTie = () => {
        return gameArray.indexOf(null) === -1;
    }

    return { add, clear, getGameArray, getTurnCount, incTurnCount, resetTurnCount, getCurrentPlayer, getPlayers, isWin, isTie };
})();

const displayController = (() => {

    const container = document.getElementById('container');

    const scoreWrapper = document.createElement('div');
    scoreWrapper.classList.add('score-wrapper');
    
    let scoreArray = [];
    gameBoard.getPlayers().forEach(player => {
        const playerEle = document.createElement('div');
        playerEle.classList.add('player');
        playerEle.innerText = player.getMark() + ':';
        let playerScore = document.createElement('div');
        playerScore.classList.add(`${player.getMark()}`);
        playerScore.innerText = player.getWins();
        scoreArray.push(playerEle);
        scoreArray.push(playerScore);
    });

    scoreWrapper.append(...scoreArray);

    const boardEle = document.createElement('ul');
    boardEle.classList.add('board');

    const gameState = document.createElement('div');
    gameState.classList.add('game-state');

    const rematchBtn = document.createElement('button');
    rematchBtn.classList.add('rematch-button');
    rematchBtn.innerText = 'Rematch';
    
    const initialBoardRender = (root) => {
        gameBoard.getGameArray().forEach((square, index) => {
            const squareEle = document.createElement('li')
            squareEle.setAttribute('index', index);
            boardEle.appendChild(squareEle);
        })
        root.appendChild(boardEle);
    }

    const boardRender = (root) => {
        gameBoard.getGameArray().forEach((square, index) => {
            boardEle.children[index].innerText = square;
        })
    };

    const init = () => {
        container.appendChild(scoreWrapper);
        initialBoardRender(container);
        container.appendChild(gameState);
        boardEle.addEventListener('click', handleClick);
        rematchBtn.addEventListener('click', startRematch);
    };

    const handleClick = (e) => {
        if(e.target.tagName.toLowerCase() === 'li' && !e.target.innerText) {
            const currentPlayer = gameBoard.getCurrentPlayer();
            setDOMTarget(e.target, currentPlayer.getMark());
            setArrayTarget(e.target.getAttribute('index'), currentPlayer.getMark());
            const winner = gameBoard.isWin();
            if(winner.isWin) {
                gameState.innerText = `${currentPlayer.getMark()} Wins!`;
                drawPattern(winner.winPattern);
                currentPlayer.incWins();
                updateWins(currentPlayer);
                gameOver();
            } else if(gameBoard.isTie()) {
                gameState.innerText = 'Tie.';
                gameOver();
            }
            gameBoard.incTurnCount();
        }
    };

    const updateWins = (player) => {
        const winner = document.querySelector(`.${player.getMark()}`);
        winner.innerText = player.getWins();
    };

    const gameOver = () => {
        boardEle.removeEventListener('click', handleClick);
        container.appendChild(rematchBtn);
    };

    const startRematch = () => {
        gameBoard.clear();
        boardRender();
        container.removeChild(rematchBtn);
        gameState.innerText = '';
        //Turns HTMLCollection of children into array
        [...boardEle.children].forEach(child => {
            child.style = null;
        });
        boardEle.addEventListener('click', handleClick);
        gameBoard.resetTurnCount();
    }

    const setDOMTarget = (target, mark) => {
        target.innerText = mark;
    };
    const setArrayTarget = (index, mark) => {
        gameBoard.add(index, mark);
    };

    const drawPattern = (pattern) => {
        pattern.forEach((index) => {
            boardEle.children[index].style = 'color: red;';
        })
    };

    return { init };
})();

displayController.init();