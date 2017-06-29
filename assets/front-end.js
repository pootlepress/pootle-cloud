/**
 * Plugin front end scripts
 *
 * @package Pootle_Cloud
 * @version 1.0.0
 */
jQuery( function ( $ ) {
	$bd = $( 'body' );
	$if = $( 'iframe#pcld-app' );
	pcld = {
		apiUrl: '',
		tkn: null,
		saveRow: function() {
			if ( $bd.hasClass( 'pcld-logged-in' ) ) {

				var tpl = JSON.parse( ppbTemplateFromRow( ppbRowI ) );
				tpl.name = prompt( 'What would you like to name this template?', 'untitled' );

				pcld.appWin.postMessage(
					{
						request: 'saveTemplate',
						tpl: tpl
					}, '*'
				)
			} else {
				alert( 'You need to login to your pootle cloud account before you can save templates.' );
			}
		},
		loginPopup: function(){
			$if.fadeIn();
		},
		receiveMessage: function( e ) {
			var msg = e[ e.message ? 'message' : 'data' ];
			if ( e.origin.replace( /http[s]?:\/\//, '' ).indexOf( pcldData.appUrl ) ) {
				if ( 'loggedIn' == msg ) {
					$bd.addClass( 'pcld-logged-in' );
					$if.fadeOut();
					pcld.appWin = e.source;
					console.log( 'Message from app' );
					console.log( msg, e );
				}
			}
		}
	};

	window.addEventListener( 'message', pcld.receiveMessage, false );
} );