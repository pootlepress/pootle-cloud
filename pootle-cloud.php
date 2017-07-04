<?php
/*
Plugin Name: Pootle Cloud
Plugin URI: http://pootlepress.com/
Description: Boilerplate for fast track Pootle Page Builder Addon Development
Author: Shramee
Version: 1.0.0
Author URI: http://shramee.com/
@developer shramee <shramee.srivastav@gmail.com>
*/

/**
 * Pootle Cloud main class
 * @static string $token Plugin token
 * @static string $file Plugin __FILE__
 * @static string $url Plugin root dir url
 * @static string $path Plugin root dir path
 * @static string $version Plugin version
 */
class Pootle_Cloud{

	/** @var Pootle_Cloud Instance */
	private static $_instance = null;

	/** @var string Token */
	public static $token;

	/** @var string Version */
	public static $version;

	/** @var string Plugin main __FILE__ */
	public static $file;

	/** @var string Plugin directory url */
	public static $url;

	/** @var string Plugin directory path */
	public static $path;

	/** @var string Pootle cloud app url */
	private $app_url;

	/**
	 * Main Pootle Cloud Instance
	 *
	 * Ensures only one instance of Storefront_Extension_Boilerplate is loaded or can be loaded.
	 *
	 * @return Pootle_Cloud instance
	 */
	public static function instance( $file ) {
		if ( null == self::$_instance ) {
			self::$_instance = new self( $file );
		}
		return self::$_instance;
	} // End instance()

	/**
	 * Constructor function.
	 * @param string $file __FILE__ of the main plugin
	 * @since   1.0.0
	 */
	private function __construct( $file ) {

		self::$token   =   'pootle-cloud';
		self::$file    =   $file;
		self::$url     =   plugin_dir_url( $file );
		self::$path    =   plugin_dir_path( $file );
		self::$version =   '1.0.0';

		// @TODO Remove this before releasing.
		$this->app_url = defined( 'PCLD_DEBUG' ) && PCLD_DEBUG ? 'http://localhost:4200/' : 'https://pootle-cloud.firebaseapp.com/';

		add_action( 'init', array( $this, 'init' ) );
	} // End __construct()

	/**
	 * Initiates the plugin
	 * @action init
	 */
	public function init() {

		if ( class_exists( 'Pootle_Page_Builder_Pro' ) ) {

			// Row settings field
			add_filter( 'pootlepb_row_settings_fields', array( $this, 'row_settings_fields' ) );
			add_filter( 'pootlepb_le_row_block_tabs', array( $this, 'row_settings_tab' ) );

			//Adding front end JS and CSS in /assets folder
			add_action( 'pootlepb_enqueue_admin_scripts', array( $this, 'enqueue' ) );

			//Adding front end JS and CSS in /assets folder
			add_action( 'pootlepb_le_dialogs', array( $this, 'dialogs' ) );

			// Tempalte tabs
			add_action( 'before_design_templates', array( $this, 'template_tab_wrap_open' ) );
			add_action( 'after_design_templates', array( $this, 'template_tab_wrap_close' ) );

			//Adding front end JS and CSS in /assets folder
			add_action( 'pootlepb_row_settings_custom_field_' . self::$token . '_save_btn', array( $this, 'save_btn' ) );
		}
	} // End enqueue()

	/**
	 * Adds row settings panel tab
	 * @param array $tabs Tabs to output in row settings panel
	 * @return array Tabs
	 * @filter pootlepb_le_row_block_tabs
	 */
	public function row_settings_tab( $tabs ) {
		$tabs['pootle-cloud'] = array(
			'label'    => 'Pootle cloud',
			'priority' => 2,
		);
		return $tabs;
	} // End enqueue()

	/**
	 * Adds row settings panel fields
	 * @param array $fields Fields to output in row settings panel
	 * @return array Fields
	 * @filter pootlepb_row_settings_fields
	 */
	public function row_settings_fields( $fields ) {
		$fields[ self::$token . '_save' ] = array(
			'name' => '',
			'type' => self::$token . '_save_btn',
			'priority' => 1,
			'tab' => 'pootle-cloud',
		);

		return $fields;
	}

	function template_tab_wrap_open () {
		?>
		<div id="pcld-template-tabs">
			<ul>
				<li><a href='#pcld-pootle-designs'>Pootle designs</a></li>
				<li><a href='#pcld-my-designs'>My designs</a></li>
			</ul>
			<div class="template" id="pcld-pootle-designs">
		<?php
	}

	function template_tab_wrap_close () {
		?>
			</div>
			<div class="template" id="pcld-my-designs"></div>
		</div>
		<?php
	}

	/**
	 * Adds button to save current row as template block
	 * @action pootlepb_row_settings_custom_field_pootle-cloud_save_button
	 */
	public function save_btn() {
		?>
		<div id="pootle-cloud-user-actions">
			<button onclick="pcld.saveRow()" id="pootle-cloud-save-row">Save template</button>
			<button onclick="pcld.manage()" id="pootle-cloud-manage">Manage templates</button>
			<button onclick="pcld.logout()" id="pootle-cloud-logout">Logout</button>
		</div>
		<div id="pootle-cloud-new-user">
			Login to pootle cloud to start saving templates.
			<button onclick="pcld.loginPopup()" id="pootle-cloud-login">Login</button>
		</div>
		<?php
	}

	/**
	 * Adds dialogs for pootle could
	 * @action pootlepb_le_dialogs
	 */
	public function dialogs() {
		?>
		<div id="pcld-app-wrap" style="display: none;" onclick="jQuery(this).fadeToggle()">
			<iframe src="<?php echo $this->app_url ?>" frameborder="0" id="pcld-app"></iframe>
		</div>
		<?php
	}

	/**
	 * Adds front end stylesheet and js
	 * @action wp_enqueue_scripts
	 */
	public function enqueue() {
		$token = self::$token;
		$url = self::$url;

		wp_enqueue_style( $token . '-css', $url . '/assets/front-end.css' );
		wp_enqueue_script( $token . '-js', $url . '/assets/front-end.js', array( 'jquery', ) );
		wp_localize_script( $token . '-js', 'pcldData', [
			'site' => site_url(),
			'appUrl' => $this->app_url,
		] );
	}
}

Pootle_Cloud::instance( __FILE__ );