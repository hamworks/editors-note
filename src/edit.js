/**
 * Dependencies
 */
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { RichText, __experimentalBlock as Block } from '@wordpress/block-editor';
import {
	Button,
	IconButton,
	Flex,
	FlexItem,
	FlexBlock,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './edit.css';

function Edit( { className, attributes: { uuid }, setAttributes } ) {
	const [ comment, setComment ] = useState( '' );
	const { postType, currentUser } = useSelect( ( select ) => {
		const { getCurrentUser, getEntityRecords } = select( 'core' );
		const { getCurrentPostType } = select( 'core/editor' );
		return {
			postType: getCurrentPostType(),
			currentUser: getCurrentUser(),
			users: getEntityRecords( 'root', 'user' ),
		};
	}, [] );

	const [ meta, setMeta ] = useEntityProp( 'postType', postType, 'meta' );
	const editorsNotes = meta._editors_notes || [];
	const editorsNote = editorsNotes.find( ( note ) => note.uuid === uuid );

	const editorsComments = editorsNote?.comments || [];

	const setEditorsNote = ( newComments ) => {
		setMeta( {
			_editors_notes: [
				...editorsNotes.filter( ( note ) => note.uuid !== uuid ),
				{
					uuid,
					comments: newComments,
				},
			],
		} );
	};

	const addEditorsComment = ( content ) => {
		const updatedEditorsComments = [
			...editorsComments,
			{
				date: moment().format(
					moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
				),
				date_gmt: moment()
					.utc()
					.format( moment.HTML5_FMT.DATETIME_LOCAL_SECONDS ),
				author: currentUser.id,
				content,
			},
		];
		setEditorsNote( updatedEditorsComments );
	};

	const removeEditorsComment = ( index ) => {
		setEditorsNote( editorsComments.filter( ( _, i ) => i !== index ) );
	};

	if ( !uuid ) {
		setAttributes( { uuid: `note-${ uuidv4() }` } );
	}
	return (
		<div className={ `editors-note ${ className }` }>
			<p className="editors-note__notice">{ __( `This block is editors note. Not display on front.`, 'editors-note' ) }</p>
			<ol className="editors-note__comments">
				{ editorsComments.map( ( { content }, i ) => (
					<li key={ i }>
						<Flex>
							<FlexItem>{ content }</FlexItem>
							<FlexItem>
								<IconButton
									icon="trash"
									label="Remove comment"
									onClick={ () =>
										removeEditorsComment( i )
									}
								/>
							</FlexItem>
						</Flex>
					</li>
				) ) }
			</ol>
			<Flex className={ 'input-comment' }>
				<FlexBlock>
					<RichText
						tagName="p"
						value={ comment }
						onChange={ ( content ) => setComment( content ) }
						placeholder={ __( 'Notes…' ) }
					/>
				</FlexBlock>
				<FlexItem>
					<Button
						isPrimary
						disabled={ !comment }
						onClick={ () => {
							addEditorsComment( comment );
							setComment( '' );
						} }
					>
						{ __( 'Comment' ) }
					</Button>
				</FlexItem>
			</Flex>
		</div>
	);
}

export default Edit;
