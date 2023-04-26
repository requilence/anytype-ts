import * as React from 'react';
import { observer } from 'mobx-react';
import { ObjectName, Icon, IconObject, ObjectDescription, DropTarget } from 'Component';
import { blockStore, menuStore, detailStore } from 'Store';
import { I, Util, ObjectUtil, keyboard, analytics } from 'Lib';
import Constant from 'json/constant.json';

type Props = {
	block: I.Block;
	subId: string;
	id: string;
	isEditing?: boolean;
	style?: any;
};

const WidgetListItem = observer(class WidgetListItem extends React.Component<Props> {

	node = null;

	render () {
		const { subId, id, block, isEditing, style } = this.props;
		const rootId = keyboard.getRootId();
		const object = detailStore.get(subId, id, Constant.sidebarRelationKeys);
		const iconSize = [ I.ObjectLayout.Task, I.ObjectLayout.Bookmark ].includes(object.layout) ? 20 : 28;
		const canDrop = !isEditing && blockStore.isAllowed(object.restrictions, [ I.RestrictionObject.Block ]);

		let descr = null;
		if (object.type == Constant.typeId.bookmark) {
			descr = (
				<div className="descr">
					{Util.shortUrl(object.source)}
				</div>
			);
		} else {
			descr = <ObjectDescription object={object} />;
		};

		let inner = (
			<div className="inner">
				<IconObject object={object} size={48} iconSize={iconSize} />
				<div className="info">
					<ObjectName object={object} />
					{descr}
				</div>
				<div className="buttons">
					<Icon className="more" tooltip="Options" onClick={(e) => this.onContext(e, true)} />
				</div>
			</div>
		);

		if (canDrop) {
			inner = (
				<DropTarget
					cacheKey={[ block.id, id ].join('-')}
					id={object.id}
					rootId={rootId}
					targetContextId={object.id}
					dropType={I.DropType.Menu}
					canDropMiddle={true}
				>
					{inner}
				</DropTarget>
			);
		};

		return (
			<div
				ref={node => this.node = node}
				className="item"
				key={object.id}
				onClick={(e) => this.onClick(e, object)}
				onContextMenu={(e) => this.onContext(e, false)}
				style={style}
			>
				{inner}
			</div>
		);
	};

	onClick = (e: React.MouseEvent, item: unknown): void => {
		e.preventDefault();
		e.stopPropagation();

		ObjectUtil.openEvent(e, item);
		analytics.event('OpenSidebarObject');
	};

	onContext = (e: React.SyntheticEvent, withElement: boolean): void => {
		e.preventDefault();
		e.stopPropagation();

		const { subId, id } = this.props;
		const node = $(this.node);
		const more = node.find('.icon.more');
		const menuParam: any = {
			classNameWrap: 'fromSidebar',
			onOpen: () => {
				node.addClass('active');
			},
			onClose: () => {
				node.removeClass('active');
			},
			data: {
				objectIds: [ id ],
				subId,
			},
		};

		if (withElement) {
			menuParam.element = more;
			menuParam.vertical = I.MenuDirection.Center;
			menuParam.offsetX = 32;
		} else {
			menuParam.recalcRect = () => {
				const { x, y } = keyboard.mouse.page;
				return { width: 0, height: 0, x: x + 4, y: y };
			};
		};

		menuStore.open('dataviewContext', menuParam);
	};

});

export default WidgetListItem;