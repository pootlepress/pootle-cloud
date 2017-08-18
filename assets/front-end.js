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
		$mydesigns = $( '#pcld-my-designs' ),
		$communitydesigns = $( '#pcld-comm-designs' ),
		$nameDlg = $( '#pcld-tpl-name-dlg' ),
		$tplName = $( '#pcld-tpl-name' );

	$nameDlg.ppbDialog( {
		dialogClass: 'ppb-dialog-wilson',
		autoOpen: false,
		draggable: false,
		resizable: false,
		title: 'Template name',
		width: 'auto',
		height: 'auto',
		buttons: {
			'Create Template': function () {
				var tpl = JSON.parse( ppbTemplateFromRow( ppbRowI ) );

				tpl.name = $tplName.val();

				if ( ! tpl.name ) {
					return alert( 'Please type in a name...' );
				}

				pcld.appMsg( 'saveTemplate', tpl );

				$loader.fadeIn();
				ppbNotify( 'Pootle Cloud: Template saved successfully' );

				$tplName.val( '' );

				$nameDlg.ppbDialog( 'close' );
			}
		}
	} );

	$( '#pcld-template-tabs' ).ppbTabs();
	pcld = {
		// Post message actions
		populateTemplates: function ( $templates, tpls, callback ) {
			if ( typeof callback !== 'function' ) {
				callback = function() {};
			}
			$templates.html( '' );
			for ( var i = 0; i < tpls.length; i ++ ) {
				var tpl = tpls[i];
				ppbDesignTpls[tpl.name] = tpl;
				var $tpl = $( '<div class="ppb-tpl" data-id="' + tpl.name + '"></div>' );
				if ( ! tpl.img ) {
					var
						style = JSON.parse( tpl.style ),
						color = style.background || style.grad_col1 || style.grad_col2;
					$tpl.html( '<div class="ppb-tpl-bg" style="padding-top:52%;background:' + color + '"></div>' );
				} else {
					$tpl.html( '<img src="' + tpl.img + '" alt="' + tpl.name + '"/>' );
				}

				$tpl.append( '<div class="label">' + tpl.name + '</div>' );

				$tpl.append( '<i class="fa fa-search"></i>' );

				callback( tpl, $tpl );

				$templates.append( $tpl );
			}
		},

		commTplExtraMarkup: function( tpl, $tpl ) {
			if ( tpl.author ) {
				var $author = $( '<span/>' ).addClass( 'tpl-author' );
				if ( tpl.authorLink ) {
					$author.html( '<a href="' + tpl.authorLink + '">' + tpl.author + '</a>' );
				} else {
					$author.html( tpl.author );
				}
				$tpl.find('.label').append( $author );
				if ( tpl.description ) {
					$tpl.append( '<span class="desc">' + tpl.description + '</span>' );
				}

				if ( ! tpl.love ) tpl.love = 0;
				$tpl.append( '<i class="fa fa-heart top-left-icon">' + tpl.love + '</i>' );

			}
		},

		postMsgActions: {

			loggedIn: function () {
				$bd.addClass( 'pcld-logged-in' );
				$appWrap.fadeOut();
				if ( pcld.showLogin ) {
					ppbNotify( 'Pootle Cloud: Log in successful' );
				}
			},

			userLoves: function ( tpls ) {
				pcld.userLoves = tpls;
				pcld.postMsgActions.commTpls( pcld.contibTpls );
			},

			loggedOut: function () {
				$bd.removeClass( 'pcld-logged-in' );
				var msg = '<h4>Please ' +
					'<a href="javascript:pcld.loginPopup()" style="color: #28d">login to your Pootle Cloud account</a>' +
					' and save some templates.</h4>';
				$mydesigns.html( msg );
				$communitydesigns.html( msg );
			},

			templates: function ( tpls ) {
				pcld.templates = tpls;
				pcld.populateTemplates( $mydesigns, tpls );
				$mydesigns.append(
					'<h4>Please ' +
					'<a href="javascript:pcld.loginPopup()" style="color: #28d">login to your Pootle Cloud account</a>' +
					' and save some templates.</h4>'
				);

			},

			commTpls: function (tpls) {
				pcld.contibTpls = tpls;

				var
					lovedTpls = [],
					lovelyTpls = [],
					newTpls = [];

				pcld.userLoves = pcld.userLoves ? pcld.userLoves : {};
				for ( var i = 0; i < tpls.length; i ++ ) {
					var tpl = tpls[i];
					if ( pcld.userLoves[tpl.name] ) {
						lovedTpls.push( tpl );
					} else if ( 1 < tpl.love ) {
						lovelyTpls.push( tpl );
					} else {
						newTpls.push( tpl );
					}
				}

				$communitydesigns.html( '' );

				if ( lovedTpls.length ) {
					$communitydesigns.append( '<h2>Templates you love</h2>' );

					var $div = $( '<div class="templates-wrap"></div>' );
					pcld.populateTemplates( $div, lovedTpls, pcld.commTplExtraMarkup );
					$communitydesigns.append( $div );
				}

				if ( lovelyTpls.length ) {
					$communitydesigns.append( '<h2>Loved templates</h2>' );
					$communitydesigns.append( '<h4>Be sure to share some love if you like these!</h4>' );

					$div = $( '<div class="templates-wrap"></div>' );
					pcld.populateTemplates( $div, lovelyTpls, pcld.commTplExtraMarkup );
					$communitydesigns.append( $div );
				}

				if ( newTpls.length ) {
					$communitydesigns.append( '<h2>New templates</h2>' );
					$communitydesigns.append( '<h4>These templates need some love before they can show in loved templates section.</h4>' );

					$div = $( '<div class="templates-wrap"></div>' );
					pcld.populateTemplates( $div, newTpls, pcld.commTplExtraMarkup );
					$communitydesigns.append( $div );
				}

			},

			doneLoading: function () {
				$loader.fadeOut();
			}

		},

		saveRow: function () {

			if ( $bd.hasClass( 'pcld-logged-in' ) ) {

				$nameDlg.ppbDialog( 'open' );

			} else {

				alert( 'You need to login to your pootle cloud account before you can save templates.' );

			}

		},

		manage: function () {
			$appWrap.fadeIn();
		},

		logout: function () {
			pcld.appMsg( 'logout' );
		},

		loginPopup: function () {
			pcld.showLogin = true;
			$appWrap.fadeIn();
		},

		appMsg: function ( cb, payload ) {
			pcld.appWin.postMessage( {
				pcldCallback: cb,
				payload: payload
			}, '*' );
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

	$communitydesigns.on( 'click', '.fa-heart', function ( e ) {
		e.stopPropagation();
		pcld.appMsg( 'loveTpl', $( this ).closest( '.ppb-tpl' ).data( 'id' ) );
	} );

	window.addEventListener( 'message', pcld.receiveMessage, false );
} );