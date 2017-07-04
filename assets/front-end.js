/**
 * Plugin front end scripts
 *
 * @package Pootle_Cloud
 * @version 1.0.0
 */
jQuery( function ( $ ) {
	var
		$bd = $( 'body' ),
		$appWrap = $( '#pcld-app-wrap' ),
		$loader = $( '#ppb-loading-overlay' ),
		$mydesigns = $( '#pcld-my-designs' );

	$( '#pcld-template-tabs' ).ppbTabs();
	pcld = {
		// Post message actions
		postMsgActions: {
			loggedIn: function () {
				$bd.addClass( 'pcld-logged-in' );
				$appWrap.fadeOut();
				if ( pcld.showLogin ) {
					ppbNotify( 'Pootle Cloud: Log in successful' );
				}
			},
			loggedOut: function () {
				$bd.removeClass( 'pcld-logged-in' );
			},
			templates: function ( tpls ) {
				pcld.templates = tpls;
				$mydesigns.html( '' );
				for ( var i = 0; i < tpls.length; i ++ ) {
					var tpl = tpls[i];
					ppbDesignTpls[tpl.name] = tpl;
					var $tpl = $( '<div class="ppb-tpl" data-id="' + tpl.name + '"></div>' );
					if ( ! tpl.img ) {
						var
							style = JSON.parse( tpl.style ),
							color = style.background || style.grad_col1 || style.grad_col2;
						$tpl.html( '<div style="padding-top:52%;background:' + color + '"></div>' );
					} else {
						$tpl.html( '<img src="' + tpl.img + '" alt="' + tpl.name + '"/>' );
					}
					$mydesigns.append( $tpl );
				}
			},
			doneLoading: function () {
				$loader.fadeOut();
			}
		},
		saveRow: function () {

			if ( $bd.hasClass( 'pcld-logged-in' ) ) {

				var tpl = JSON.parse( ppbTemplateFromRow( ppbRowI ) );
				tpl.name = prompt( 'What would you like to name this template?', 'untitled' );

				pcld.appWin.postMessage( {
					pcldCallback: 'saveTemplate',
					payload: tpl
				}, '*' );

				$loader.fadeIn();
				ppbNotify( 'Pootle Cloud: Template saved successfully' );

			} else {

				alert( 'You need to login to your pootle cloud account before you can save templates.' );

			}

		},
		manage: function () {
			$appWrap.fadeIn();
		},
		logout: function () {

			pcld.appWin.postMessage( {
				pcldCallback: 'logout'
			}, '*' );

		},
		loginPopup: function () {
			pcld.showLogin = true;
			$appWrap.fadeIn();
		},
		receiveMessage: function ( e ) {

			var
				callback, payload,
				msg = e[e.message ? 'message' : 'data'];

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