// DISCLAIMER: DOESNT WORK THAT WELL

// use https://try.terser.org/ to condense into single line
// add "javascript:" in front
// put into "URL" section of a bookmark
// click on the bookmark to use

javascript: (() => {
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

    let searchDepth = 10
    let HTMLnumberElements = document.getElementsByClassName("number")
    let gameBoard = []
    // may need to change for different websites
    for (let ele of HTMLnumberElements) {
        gameBoard.push(ele.innerText * 1)
    }
    let boardLength = Math.sqrt(gameBoard.length)
    let running = true
    moveOnBoard(gameBoard, boardLength, maximize(searchDepth, searchDepth, gameBoard, boardLength), HTMLnumberElements)
    
    
    //moveOnBoard(gameBoard, boardLength, "left", HTMLnumberElements)
    //console.log("current eval: ", evalBoard(gameBoard, boardLength))
})();

// minimized version:
javascript:(()=>{function n(n,e){let f=0,r=2*(e-1);for(let o=0;o<n.length;o++)0!=o&&(Math.floor((o-1)/e)<=e-2?f+=(r-t({x:n.indexOf(o)%e,y:Math.floor(n.indexOf(o)/e)},{x:(o-1)%e,y:Math.floor((o-1)/e)}))*10**(2*(e-Math.floor((o-1)/e)-1)):f+=(r-t({x:n.indexOf(o)%e,y:Math.floor(n.indexOf(o)/e)},{x:(o-1)%e,y:Math.floor((o-1)/e)}))*10**(e-(o-1)%e-1));return f}function t(n,t){return Math.abs(n.x-t.x)+Math.abs(n.y-t.y)}function e(n,t,e){let f=n[t];n[t]=n[e],n[e]=f}function f(n,t,f){e(n,n.indexOf(0),n.indexOf(0)+{left:-1,right:1,up:-t,down:t}[f])}function r(n,t,f){e(n,n.indexOf(0),n.indexOf(0)-{left:-1,right:1,up:-t,down:t}[f])}function o(n){for(let t=0;t<n.length-1;t++)if(n[t]!=t+1)return!1;return!0}function i(n,t){var e=[];return n.indexOf(0)%t!=0&&e.push("left"),n.indexOf(0)%t!=t-1&&e.push("right"),n.indexOf(0)>=t&&e.push("up"),n.indexOf(0)<n.length-t&&e.push("down"),e}let u=document.getElementsByClassName("number"),l=[];for(let n of u)l.push(1*n.innerText);let h=Math.sqrt(l.length);var x,a,d;x=l,a=h,d=function t(e,u,l,h){if(0===u)return n(l,h);var x=null,a=i(l,h);a.sort((function(n,t){return.5-Math.random()}));for(var d=-2e4,O=0;O<a.length;O++){let n=0;f(l,h,a[O]),n=o(l)?1e10*u:t(e,u-1,l,h),n>=d&&(d=n,x=a[O]),r(l,h,a[O])}return u===e?x:d}(10,10,l,h),u[x.indexOf(0)+{left:-1,right:1,up:-a,down:a}[d]].click(),f(x,a,d)})();