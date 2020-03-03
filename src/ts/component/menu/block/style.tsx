import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Icon, MenuItemVertical } from 'ts/component';
import { I, keyboard, Key, Util, DataUtil, dispatcher } from 'ts/lib';
import { blockStore, commonStore } from 'ts/store';
import { observer } from 'mobx-react';

interface Props extends I.Menu {};

const $ = require('jquery');

@observer
class MenuBlockStyle extends React.Component<Props, {}> {
	
	n: number = 0;
	
	constructor (props: any) {
		super(props);
		
		this.onClick = this.onClick.bind(this);
	};

	render () {
		const sections = this.getSections();
		const active = this.getActive();
		
		const Section = (item: any) => (
			<div className="section">
				{item.children.map((action: any, i: number) => (
					<MenuItemVertical key={i} {...action} isActive={action.id == active} onClick={(e: any) => { this.onClick(e, action); }} onMouseEnter={(e: any) => { this.onOver(e, action); }}  />
				))}
			</div>
		);
		
		return (
			<div>
				{sections.map((section: any, i: number) => {
					return <Section key={i} {...section} />;
				})}
			</div>
		);
	};
	
	componentDidMount () {
		const items = this.getItems();
		const active = this.getActive();

		this.n = items.findIndex((it: any) => { return it.id == active; });
		this.unbind();
		this.setActive();
		
		const win = $(window);
		win.on('keydown.menu', (e: any) => { this.onKeyDown(e); });
	};
	
	componentWillUnmount () {
		const { param } = this.props;
		const { data } = param;
		const { rebind } = data;

		this.unbind();
		
		if (rebind) {
			rebind();
		};
	};
	
	unbind () {
		$(window).unbind('keydown.menu');
	};
	
	getActive () {
		const { param } = this.props;
		const { data } = param;
		const { blockId, rootId } = data;
		const list = blockStore.blocksGet(rootId);
		const block = list.find((it: I.Block) => { return it.id == blockId; });
		return block ? block.content.style : 0;
	};
	
	setActive = (item?: any, scroll?: boolean) => {
		const items = this.getItems();
		if (item) {
			this.n = items.findIndex((it: any) => { return it.id == item.id });
		};
		Util.menuSetActive(this.props.id, items[this.n], 12, scroll);
	};
	
	getSections () {
		return [
			{ children: DataUtil.menuGetBlockText() },
			{ children: DataUtil.menuGetBlockList() },
			{ children: DataUtil.menuGetBlockPage() },
			{ children: DataUtil.menuGetTurnObject() },
		];
	};
	
	getItems () {
		const sections = this.getSections();
		
		let items: any[] = [];
		for (let section of sections) {
			items = items.concat(section.children);
		};
		return items;
	};
	
	onKeyDown (e: any) {
		e.preventDefault();
		e.stopPropagation();
		
		keyboard.disableMouse(true);
		
		const k = e.which;
		const node = $(ReactDOM.findDOMNode(this));
		const items = this.getItems();
		const l = items.length;
		const item = items[this.n];
		
		switch (k) {
			case Key.up:
				this.n--;
				if (this.n < 0) {
					this.n = l - 1;
				};
				this.setActive(null, item);
				break;
				
			case Key.down:
				this.n++;
				if (this.n > l - 1) {
					this.n = 0;
				};
				this.setActive(null, item);
				break;
				
			case Key.enter:
			case Key.space:
				if (item) {
					this.onClick(e, item);
				};
				break;
			
			case Key.left:	
			case Key.escape:
				commonStore.menuClose(this.props.id);
				break;
		};
	};
	
	onOver (e: any, item: any) {
		if (!keyboard.mouse) {
			return;
		};
		this.setActive(item, false);
	};
	
	onClick (e: any, item: any) {
		const { param } = this.props;
		const { data } = param;
		const { onSelect, dataset } = data;
		const { selection } = dataset;
		
		commonStore.menuClose(this.props.id);
		onSelect(item);
		selection.clear();
	};

};

export default MenuBlockStyle;