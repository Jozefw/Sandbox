
var ttt = (function (my, $) {
  my.display = function(){
  	var $boxes = $('.row div');

	var init = function() {   // private method
		// $boxes.on('click', function(e) {
		// 	console.log( e );
		// });
	}();

	var clear = function() {	// public methods, part of the interface

	},

	// callback has to be a function passed in
	getMove = function( callback ) {
		var which;

		$boxes.on('click', function(e) {
			which = e.target.id;
			$boxes.off();
			callback( which );
		});
	},

	makeTheMove = function( who, where) {

	},

	showBoard = function(bd) {
		for (var i = 0; i < 9; i++) {
			if ( bd[i] !== '' ) {
				$( '#' + i ).html( '<span class="space">' + bd[i] + '</span>' );
			}
		}
		console.log('');
		console.log(bd[0] + ' | ' + bd[1] + ' | ' + bd[2] );
		console.log('-------');
		console.log(bd[3] + ' | ' + bd[4] + ' | ' + bd[5] );
		console.log('-------');
		console.log(bd[6] + ' | ' + bd[7] + ' | ' + bd[8] );
	},


	showWin = function( who ) {
		$('#board').fadeOut('slow').fadeIn();
	};

	return {
		clear : clear,
		makeMove : makeTheMove,
		getMove : getMove,
		showWin : showWin,
		showBoard : showBoard
	};
  }();

  return my;
}(ttt || {}, $ ));


