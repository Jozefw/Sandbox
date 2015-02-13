var myDataRef = new Firebase('https://t-cubed.firebaseio.com/');

var $tableTemplate = $("#tableTemplate"),
		$select = $("select"),
		$nextMove = $("#nextMove"),
		snapShotIndex,
		str,
		s,
		resetCounter,
		d;

$tableTemplate.hide();
$nextMove.hide();

function displayPrevGame() {
	$tableTemplate.show().appendTo(".prerecorded");
	$nextMove.show().appendTo('.prerecorded');
};

var buttonHandler = function() {
	$nextMove.on( 'click', advanceMove );
};

var advanceMove = function () {
	if ( snapShotIndex < data[str].board.length ) {
		showMove( snapShotIndex );
		snapShotIndex += 1;
	}
	else {
		// end of show
		$nextMove.off();	// turn of handler for advance Move button
		$nextMove.text('done');
	}
};

var showMove = function( index ) {
	for ( var i = 0; i < 9; i++ ) {
		// dont need to even check to see if its empty, 'x' or 'o', just do it.
		$( "#" + i ).text( data[str].board[ index ][i] );
	}
};

function showGameSelected () {
	$("#gameSelect").change(function() {
		str = "";
		$("select option:selected").each(function() {
			str = str + $(this).val();
		});
		$(this).off();
	 	// show what game was chosen
		$(".prerecorded").append( new Date(Number( str )).toLocaleString() ); 
		buttonHandler();
		displayPrevGame();
		showMove(0);
		snapShotIndex = 1;
	});

}


	myDataRef.on('value', function(snapshot) {
	console.log("value fired off" + snapshot.val());
	data = snapshot.val();
	gamePicked = Object.keys(data);
		for ( var i = 0; i < gamePicked.length; i++ ) {
			d = new Date(gamePicked[i]*1).toLocaleString();
			s = '<option value="' + ( gamePicked[i] * 1 ) + '">' + d + '</option>';
			$select.append(s);
		}
	showGameSelected();
	});

