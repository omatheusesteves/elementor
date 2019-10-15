import HookAfter from '../../../hooks/after';
import Container from '../../../../container/container';
import Create from '../../commands/create';

export class SectionColumns extends HookAfter {
	hook() {
		return 'document/elements/create';
	}

	id() {
		return 'create-section-columns';
	}

	conditioning( args ) {
		return ! args.model || 'section' !== args.model.elType || args.model.elements;
	}

	/**
	 * @inheritDoc
	 *
	 * @param {{}} args
	 * @param {Container||Container[]} containers
	 *
	 * @returns {Boolean}
	 */
	apply( args, containers ) {
		const { structure = false, options = {} } = args;

		if ( ! Array.isArray( containers ) ) {
			containers = [ containers ];
		}

		let { columns = 1 } = args;

		if ( args.model.isInner && 1 === columns ) {
			columns = containers[ 0 ].view.defaultInnerSectionColumns;
		}

		containers.forEach( ( /**Container*/ container ) => {
			for ( let loopIndex = 0; loopIndex < columns; loopIndex++ ) {
				const model = {
					id: elementor.helpers.getUniqueID(),
					elType: 'column',
					settings: {},
					elements: [],
				};

				container.view.addChildModel( model, options );

				/**
				 * Manual history & not using of `$e.run('document/elements/create')`
				 * For performance reasons.
				 */
				$e.run( 'document/history/addSubItem', {
					container,
					type: 'sub-add',
					elementType: 'column',
					restore: Create.restore,
					options,
					data: {
						toRestoreContainer: container,
						toRestoreModel: model,
					},
				} );
			}
		} );

		if ( structure ) {
			containers.forEach( ( container ) => {
				container.view.setStructure( structure );

				// Focus on last container.
				container.model.trigger( 'request:edit' );
			} );
		}
	}
}

export default SectionColumns;
