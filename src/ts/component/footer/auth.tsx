import * as React from 'react';
import { Icon } from 'ts/component';
import { I, Util } from 'ts/lib';
import { menuStore } from 'ts/store';

interface Props {};

class FooterAuth extends React.Component<Props, {}> {
	
	constructor (props: any) {
		super(props);
		
		this.onHelp = this.onHelp.bind(this);
	};

	render () {
		const date = (new Date()).getTime() / 1000;
		
		return (
			<div className="footer">
				<div className="copy">{Util.date('Y', date)}, Anytype</div>
				<Icon id="button-help" className="help light" onMouseDown={this.onHelp} />
			</div>
		);
	};

	onHelp () {
		menuStore.open('help', {
			element: '#button-help',
			offsetY: 4,
			vertical: I.MenuDirection.Top,
			horizontal: I.MenuDirection.Right
		});
	};

};

export default FooterAuth;