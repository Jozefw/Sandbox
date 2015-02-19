$(function() {

	// Change this to YOUR FIREBASE ACCOUNT  !!!
	var FIREBASE_ACCOUNT = ('https://t-cubed.firebaseio.com/');

	var myDataRef = new Firebase( FIREBASE_ACCOUNT ),
		$select = $("select"),
		$nextMove = $('#nextMove'),
		$gameSelect = $("#gameSelect"),
		$choice = $('#choice'),
		$liveGameIndicator = $('#liveGameIndicator'),
		gamesArray,
		data,
		bPreRecordedChosen = false,
		bLiveGameInProgress = false,
		preRecordedGameId,
		liveGameId;

// the initialize fx is same as function(snapshot) in firebase.
	function initialize( firebaseDataDump ) {
		// First get the initial dump of pre-recorded games that firebase sends us
		if ( firebaseDataDump.exists() ) {
			data = firebaseDataDump.val();
			gamesArray = Object.keys( data );
			fillPreRecordedGamesSelectBox( data, gamesArray );
			handlePreRecordedSelection();
		} 
		else {	// nothing in database!
			// TODO: deal with it.
		}

		prepareForLiveGame();
	}


	function prepareForLiveGame() {
		var eventCount = 0, 
			k;

		function dealWithLiveGame() {
			var liveEvents = 0;

			myDataRef.on( 'value', function(s) {
				// liveGameId is the key of the board
				if ( s.val()[liveGameId].board ) {
					for ( var i = 0; i < 9; i++ ) {
						$( "#" + (i + 20) ).text( s.val()[liveGameId].board[ liveEvents ][i] );
						console.log(s.val()[liveGameId].board[ liveEvents ][i])
					}
					liveEvents += 1;				
				}
			});	
		}

		// At startup time, we get as many child_added events from firebase as there
		// are pre-recorded games.  But firebase also fires off a child_added event
		// as soon as a live game starts.  So we keep a count, and when that count exceeds
		// the number of known pre-recorded games, we know there is a live game going on.
		myDataRef.on( 'child_added', function(snapshot) {
			eventCount++; 
			// console.log('Got a child_added event');
			if ( eventCount > gamesArray.length && !bLiveGameInProgress ) {
				bLiveGameInProgress = true;
				$liveGameIndicator.show();
				$liveGameIndicator.text('live game in progress');

				myDataRef.once( 'value', function(snap){
					// snap has all the games, plus the fragments of the new live game.
					// Lets go through all the games snap shows us and see which one
					// is not in the list of pre-recorded games.
					console.log( snap.val() );
					for (k in snap.val()) {
						if ( ! data[k] ) {   // if data obj doesn't have this key...
							liveGameId = k;
						}
					}

					dealWithLiveGame();
				});
			}
		});
	}


	var showGame = function( which ) {
		var index = 0;

		var showMove = function( idx ) {
			for ( var i = 0; i < 9; i++ ) {
				// dont need to even check to see if its empty, 'x' or 'o', games are already persisted
				$( "#" + i ).text( data[which].board[ idx ][i] );
			}
		},

		nextMove = function( ) {
			if ( index < data[which].board.length  ) {
				$nextMove.fadeOut(50).fadeIn(50);
				showMove( index++ );
				$nextMove.one( 'click', nextMove );
			} else {
				console.log('Game Over');
				bPreRecordedChosen = false;
				$nextMove.text('The End').fadeOut('slow').fadeIn('slow/400/fast', function() {
					
				});;
			}
		};

		if ( index < data[which].board.length ) {
			showMove( index++ );
			$nextMove.one( 'click', nextMove );
		}
	};



	function fillPreRecordedGamesSelectBox( data, gamesArray ) {
		var convertedDate,
			html;

		for ( var i = 0; i < gamesArray.length; i++ ) {
			convertedDate = new Date( gamesArray[i] * 1 ).toLocaleString();
			html = '<option value="' + ( gamesArray[i] * 1 ) + '">' + convertedDate + '</option>';
			$select.append( html );
		}
	}


	function handlePreRecordedSelection() {
		$gameSelect.one( 'change', function() {
			var str = '';

			// Put together all the games selected (if more than one)
			$gameSelect.find(':selected').each(function() {
				str += $(this).val();
			});

			bPreRecordedChosen = true;
			preRecordedGameId = str;

			// Show what game was chosen
			$choice.append ( str + '<br>' + ( new Date(Number( str )).toLocaleString() ) );
			$nextMove.show();
			showGame( preRecordedGameId );
		});
	}

	// Set up a handler to catch the value event, just once...this is firebase syntax, not JS or Jquery....also, the initialize fx is same as function(snapshot) in firebase.
	myDataRef.once( 'value', initialize );

});