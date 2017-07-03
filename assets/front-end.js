/**
 * Plugin front end scripts
 *
 * @package Pootle_Cloud
 * @version 1.0.0
 */
jQuery( function ( $ ) {
	var
		$bd = $( 'body' ),
		$if = $( 'iframe#pcld-app' ),
		$loader = $( '#ppb-loading-overlay' ),
		$mydesigns = $( '#pcld-my-designs' );

	$( '#pcld-template-tabs' ).ppbTabs();
	pcld = {
		// Post message actions
		postMsgActions: {
			loggedIn: function() {
				$bd.addClass( 'pcld-logged-in' );
				$if.fadeOut();
				if ( pcld.showLogin ) {
					ppbNotify( 'Pootle Cloud: Log in successful' );
				}
			},
			templates: function ( tpls ) {
				pcld.templates = tpls;
				$mydesigns.html( '' );
				for ( var i = 0; i < tpls.length; i ++ ) {
					var tpl = tpls[i];
					ppbDesignTpls[ tpl.name ] = tpl;
					var $tpl = $( '<div class="ppb-tpl" data-id="' + tpl.name + '"></div>' );
					$tpl.html( '<img src="' + tpl.img + '" alt="' + tpl.name + '"/>' );
					$mydesigns.append( $tpl );
				}
			},
			doneLoading: function() {
				$loader.fadeOut();
			}
		},
		saveRow: function() {

			if ( $bd.hasClass( 'pcld-logged-in' ) ) {

				var tpl = JSON.parse( ppbTemplateFromRow( ppbRowI ) );
				tpl.name = prompt( 'What would you like to name this template?', 'untitled' );

				pcld.appWin.postMessage( {
					pcldCallback: 'saveTemplate',
					payload: tpl
				}, '*' );

				$loader.fadeIn();
				if ( pcld.showLogin ) {
					ppbNotify( 'Pootle Cloud: Row saved successfully' );
				}

			} else {

				alert( 'You need to login to your pootle cloud account before you can save templates.' );

			}

		},
		loginPopup: function(){

			pcld.showLogin = true;
			$if.fadeIn();

		},
		receiveMessage: function( e ) {

			var
				callback, payload,
				msg = e[ e.message ? 'message' : 'data' ];

			if ( e.origin.replace( /http[s]?:\/\//, '' ).indexOf( pcldData.appUrl ) && msg.pcldCallback ) {

				callback = msg.pcldCallback;
				payload = msg.payload;

				if ( typeof pcld.postMsgActions[callback] === 'function' ) {

					// Call post message action callback
					pcld.postMsgActions[callback]( payload );
					pcld.appWin = e.source;

				}

			}

		}

	};

	window.addEventListener( 'message', pcld.receiveMessage, false );
} );