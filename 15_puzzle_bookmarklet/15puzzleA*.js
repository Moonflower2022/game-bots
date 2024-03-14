javascript: (() => {
    class PriorityQueue {
        constructor() {
            this.queue = [];
        }

        enqueue(element, priority) {
            this.queue.push({ element, priority });
            this.sort();
        }

        dequeue() {
            if (this.isEmpty()) {
                return null;
            }
            return this.queue.shift().element;
        }

        sort() {
            this.queue.sort((a, b) => a.priority - b.priority);
        }

        isEmpty() {
            return this.queue.length === 0;
        }
    }
    class HashSet {
        constructor() {
            this.set = new Set();
        }

        add(element) {
            this.set.add(JSON.stringify(element));
        }

        has(element) {
            return this.set.has(JSON.stringify(element));
        }
    }

    function manhattanDistance(state, memoizedDistances) {
        if (memoizedDistances.has(JSON.stringify(state))) {
            return memoizedDistances.get(JSON.stringify(state));
        }

        let distance = 0;
        for (let i = 0; i < state.length; i++) {
            if (state[i] !== 0) {
                const row = Math.floor(i / 4);
                const col = i % 4;
                const goalRow = Math.floor((state[i] - 1) / 4);
                const goalCol = (state[i] - 1) % 4;
                distance += Math.abs(row - goalRow) + Math.abs(col - goalCol);
            }
        }

        memoizedDistances.set(JSON.stringify(state), distance);
        return distance;
    }

    function getAdjacentStates(state) {
        const adjacentStates = [];
        const emptySquareIndex = getEmptySquareIndex(state);
        const emptySquareRow = Math.floor(emptySquareIndex / 4);
        const emptySquareCol = emptySquareIndex % 4;

        // Move empty square left
        if (emptySquareCol > 0) {
            const newState = [...state];
            const swapIndex = emptySquareIndex - 1;
            [newState[emptySquareIndex], newState[swapIndex]] = [newState[swapIndex], newState[emptySquareIndex]];
            adjacentStates.push(newState);
        }

        // Move empty square right
        if (emptySquareCol < 3) {
            const newState = [...state];
            const swapIndex = emptySquareIndex + 1;
            [newState[emptySquareIndex], newState[swapIndex]] = [newState[swapIndex], newState[emptySquareIndex]];
            adjacentStates.push(newState);
        }

        // Move empty square up
        if (emptySquareRow > 0) {
            const newState = [...state];
            const swapIndex = emptySquareIndex - 4;
            [newState[emptySquareIndex], newState[swapIndex]] = [newState[swapIndex], newState[emptySquareIndex]];
            adjacentStates.push(newState);
        }

        // Move empty square down
        if (emptySquareRow < 3) {
            const newState = [...state];
            const swapIndex = emptySquareIndex + 4;
            [newState[emptySquareIndex], newState[swapIndex]] = [newState[swapIndex], newState[emptySquareIndex]];
            adjacentStates.push(newState);
        }

        return adjacentStates;
    }

    function solve15Puzzle(initialState) {
        const goalState = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

        const openSet = new PriorityQueue();
        openSet.enqueue(initialState, 0);

        const closedSet = new HashSet();
        closedSet.add(initialState);

        const cameFrom = new Map();
        const gScore = new Map();
        gScore.set(JSON.stringify(initialState), 0);

        const memoizedDistances = new Map();

        while (!openSet.isEmpty()) {
            const currentState = openSet.dequeue();

            if (JSON.stringify(currentState) === JSON.stringify(goalState)) {
                // Goal state reached, generate list of directions
                const directions = [];
                let state = currentState;
                while (cameFrom.has(JSON.stringify(state))) {
                    const prevState = cameFrom.get(JSON.stringify(state));
                    const emptySquareIndex = getEmptySquareIndex(state);
                    const prevEmptySquareIndex = getEmptySquareIndex(prevState);
                    if (emptySquareIndex - prevEmptySquareIndex === 1) {
                        directions.unshift("left");
                    } else if (emptySquareIndex - prevEmptySquareIndex === -1) {
                        directions.unshift("right");
                    } else if (emptySquareIndex - prevEmptySquareIndex === 4) {
                        directions.unshift("up");
                    } else if (emptySquareIndex - prevEmptySquareIndex === -4) {
                        directions.unshift("down");
                    }
                    state = prevState;
                }
                return directions;
            }

            const adjacentStates = getAdjacentStates(currentState);
            for (const nextState of adjacentStates) {
                const tentativeGScore = gScore.get(JSON.stringify(currentState)) + 1;
                if (!gScore.has(JSON.stringify(nextState)) || tentativeGScore < gScore.get(JSON.stringify(nextState))) {
                    cameFrom.set(JSON.stringify(nextState), currentState);
                    gScore.set(JSON.stringify(nextState), tentativeGScore);
                    const fScore = tentativeGScore + manhattanDistance(nextState, memoizedDistances);
                    if (!closedSet.has(nextState)) {
                        openSet.enqueue(nextState, fScore);
                        closedSet.add(nextState);
                    }
                }
            }
        }

        // No solution found
        return null;
    }

    function getEmptySquareIndex(state) {
        return state.indexOf(0);
    }

    function swap(array, index1, index2) {
        let temp = array[index1];
        array[index1] = array[index2];
        array[index2] = temp;
    };

    function evalBoard(board, length) {
        let weight = 0;
        let longestDistance = (length - 1) * 2;
        for (let i = 0; i < board.length; i++) {
            if (i != 0) {
                if (Math.floor((i - 1) / length) <= length - 2) {
                    weight += (longestDistance - taxiDistance(
                        { x: board.indexOf(i) % length, y: Math.floor(board.indexOf(i) / length) },
                        { x: (i - 1) % length, y: Math.floor((i - 1) / length) }
                    )) * (10 ** (2 * (length - Math.floor((i - 1) / length) - 1)))
                } else {
                    weight += (longestDistance - taxiDistance(
                        { x: board.indexOf(i) % length, y: Math.floor(board.indexOf(i) / length) },
                        { x: (i - 1) % length, y: Math.floor((i - 1) / length) }
                    )) * (10 ** (length - (i - 1) % length - 1))
                }
            }
        }
        return weight
    }
    function taxiDistance(pos1, pos2) {
        return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y)
    }
    function swap(array, index1, index2) {
        let temp = array[index1];
        array[index1] = array[index2];
        array[index2] = temp;

    };

    //direction of travel of the the empty space, elements is the original array of the square html elements
    function moveOnBoard(board, length, direction, elements) {
        elements[board.indexOf(0) + { left: -1, right: 1, up: -length, down: length }[direction]].click()
        move(board, length, direction)
    }
    function move(board, length, direction) {
        swap(board, board.indexOf(0), board.indexOf(0) + { left: -1, right: 1, up: -length, down: length }[direction])
    }
    function undoMove(board, length, direction) {
        swap(board, board.indexOf(0), board.indexOf(0) - { left: -1, right: 1, up: -length, down: length }[direction])

    }
    function gameIsOver(board) {
        for (let i = 0; i < board.length - 1; i++) {
            if (board[i] != i + 1){
                return false
            }
        }
        return true
    }
    function getValidMoves(board, length) {
        var moves = []
        if (board.indexOf(0) % length != 0) {
            moves.push("left")
        }
        if (board.indexOf(0) % length != length - 1) {
            moves.push("right")
        }
        if (board.indexOf(0) >= length) {
            moves.push("up")
        }
        if (board.indexOf(0) < board.length - length) {
            moves.push("down")
        }
        return moves
    }
    // depth should be searchDepth
    function maximize(originalDepth, depth, board, length) {
        if (depth === 0) {
            return evalBoard(board, length)
        }
        var bestMove = null;
        var possibleMoves = getValidMoves(board, length)
        possibleMoves.sort(function (a, b) { return 0.5 - Math.random() });
        var bestMoveScore = -20000
        for (var i = 0; i < possibleMoves.length; i++) {
            let value = 0;

            move(board, length, possibleMoves[i])

            if (gameIsOver(board)) {
                value = 10000000000 * (depth)
            } else {
                value = maximize(originalDepth, depth - 1, board, length)
            }
            // Look for moves that maximize position
            if (value >= bestMoveScore) {
                bestMoveScore = value;
                bestMove = possibleMoves[i];
            }
            undoMove(board, length, possibleMoves[i])
        }
        //depth === originalDepth ? console.log("best found eval: ", bestMoveScore) : null
        return depth === originalDepth ? bestMove : bestMoveScore
    }
    function maximize2(originalDepth, depth, board, length) {
        if (depth === 0) {
            return evalBoard(board, length)
        }
        var evals = []
        var possibleMoves = getValidMoves(board, length)
        // possibleMoves.sort(function (a, b) { return 0.5 - Math.random() });
        for (var i = 0; i < possibleMoves.length; i++) {
            move(board, length, possibleMoves[i])

            if (gameIsOver(board)) {
                //console.log("GAME OVER FOUND")
                evals.push(100000)
            } else {
                evals.push(maximize2(originalDepth, depth - 1, board, length))
            }
            undoMove(board, length, possibleMoves[i])
        }
        if (depth === originalDepth) {
            return possibleMoves[evals.indexOf(Math.max(...evals))]
        } else {
            return Math.max(...evals)
        }
    }

    function passedStep1(board){
        for (let i = 0; i < 8; i++){
            if (board[i] != i + 1){
                return false
            }
        }
        return true
    }

    let searchDepth = 10
    
    // Example usage
    let HTMLnumberElements = document.getElementsByClassName("number")
    let gameBoard = []

    // may need to change for different websites
    for (let ele of HTMLnumberElements) {
        gameBoard.push(ele.innerText * 1)
    }
    const length = Math.sqrt(gameBoard.length)

    while (!passedStep1(gameBoard)){
        moveOnBoard(gameBoard, length, maximize(searchDepth, searchDepth, gameBoard, length), HTMLnumberElements)
    }

    const directions = solve15Puzzle(gameBoard);
    console.log(directions);
    for (const direction of directions){
        HTMLnumberElements[gameBoard.indexOf(0) - { left: -1, right: 1, up: -length, down: length }[direction]].click()
        swap(gameBoard, gameBoard.indexOf(0), gameBoard.indexOf(0) - { left: -1, right: 1, up: -length, down: length }[direction])
    }

})();