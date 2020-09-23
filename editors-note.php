<?php
/**
 * Plugin Name:     Editors note
 * Plugin URI:      https://github.com/team-hamworks/editors-note
 * Description:     Editors note for Block editor.
 * Author:          HAMWORKS
 * Author URI:      https://ham.works
 * License:         GPLv2 or later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     editors-note
 * Domain Path:     /languages
 * Version: 0.0.2
 */

namespace HAMWORKS\WP\Editors_Note;

add_action( 'init', function () {
	register_block_type_from_metadata( __DIR__ );
} );

add_action( 'init', function () {
	register_post_meta( '', '_editors_notes', array(
		'single'        => true,
		'type'          => 'array',
		'show_in_rest'  => array(
			'schema' => array(
				'items' => array(
					'type'       => 'object',
					'properties' => array(
						'uuid'    => array(
							'type' => 'string',
						),
						'comments'  => array(
							'type' => 'array',
							'items' => array(
								'type' => 'object',
								'properties' => array(
									'date' => array(
										'type'   => 'string',
										'format' => 'date-time',
									),
									'date_gmt' => array(
										'type'   => 'string',
										'format' => 'date-time',
									),
									'content' => array(
										'type' => 'string',
									),
									'author' => array(
										'type' => 'number'
									)
								)
							)
						)
					),
				),
			),
		),
		'auth_callback' => function ( $allowed, $meta_key, $post_ID, $user_id, $cap, $caps ) {
			return current_user_can( 'edit_post', $post_ID );
		}
	) );
} );
