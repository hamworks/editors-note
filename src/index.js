import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import metadata from '../block.json';

const { name } = metadata;

import edit from './edit';

registerBlockType( name, {
	...metadata,
	title: __( 'Editors note', 'editors-note' ),
	edit,
	save: () => null,
} );
