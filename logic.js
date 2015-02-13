var ttt = (function (my) {
  my.logic = function(){
  	var board = [],
  		where,
  		win = false,
  		whoseTurn = (( Math.random() * 10 ) > 5) ? 'X' : 'O',
      moveCount = 0,
      winCondtions = [ 
        [0,1,2], [3,4,5], [6,7,8],  // horizontal
        [0,3,6], [1,4,7], [2,5,8],  // vertical
        [0,4,8], [2,4,6]            // diagonal
      ],
      startTime,
      boards = [],
      myDataRef;

  	var init = function() {
      myDataRef = new Firebase('https://t-cubed.firebaseio.com/');
      startTime = new Date();
      startTime = startTime.valueOf();

      var o = {};
      o[startTime] = { player1: 'John', player2: "Sue", board : '' };
      myDataRef.update( o );

  		for ( var i = 0; i < 9; i++ ) {
  			board[i] = '';
  		}

  		my.display.showBoard( board );
  	},

  	pickMove = function() {
  		var move;

  		var onBoxClick = function( box ) {
	  		if ( board[box] === '' ) {
	  			// console.log('Good spot, lets go: ' + box);
	  			where = box;
          runMain();
	  		}
	  		else {
	  			console.log("Spot is TAKEN, try again!");
	  			pickMove();
	  		}

  		};

  		my.display.getMove( onBoxClick );
  	},

  	changeTurn = function() {
  		if (whoseTurn === "X") {
  			whoseTurn = "O";
  		}
  		else{
  			whoseTurn = "X";
  		}
  	},

  	makeMove = function() {
      moveCount += 1;
  		board[where] = whoseTurn;
  	},

  	checkForWin = function() {
      for ( var i = 0; i < winCondtions.length; i++ ) {

        if ( board[ winCondtions[i][0] ] === whoseTurn &&
             board[ winCondtions[i][1] ]=== whoseTurn &&
             board[ winCondtions[i][2] ]=== whoseTurn ) {
          console.log('WIN!');
          return true;
        }
      }
      return false;
  	},

  	finishGame = function() {
      if ( win ) {
        console.log( 'We have a winner: ' + whoseTurn );
        my.display.showWin();
      }
      else {
         console.log( "Tie Game");
      }
  	},

  	startGame = function() {
  		init();
  		pickMove();
  	}(),

  	runMain = function() {
      var madeMove = makeMove(),
          gameRef = myDataRef.child( startTime ),
          bdCopy = board.slice();

//      myDataRef.push( { board : board, player1 : "John", player2 : "Jane", gameTime: startTime  } );
   //   myDataRef.update ( { gameTime: startTime, board : board, player1 : "John", player2 : "Jane" } );

      boards.push(bdCopy);
      gameRef.update( { board : boards } );

  		my.display.showBoard( board );
  		win = checkForWin();

  		if ( win  || moveCount === 9 ) {  // TODO: deal with tie games
  			finishGame();
      }
      else {
        changeTurn();
  			pickMove();
  		}
  	};

  	return {
  		init : init,
  		pickMove : pickMove,
  		changeTurn : changeTurn,
  		makeMove : makeMove,
  		checkForWin : checkForWin,
  		finishGame : finishGame
  	};
  }();

  return my;
}(ttt || {}));



// var afunct = ( function(x) { x ... }(32) );



