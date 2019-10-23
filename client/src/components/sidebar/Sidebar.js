import React from 'react';
import './Sidebar.scss';

import { Button } from 'reactstrap';

function Sidebar() {
  return (
    <div className="Sidebar pannel">
    	<div className="translucent"></div>
    	<div className="console">
    	</div>

    	<div className="dpad">
			<Button className="round-button N" color="primary">N</Button>
			<div className="center">
				<Button className="round-button E" color="primary">E</Button>
				<Button className="round-button W" color="primary">W</Button>
			</div>
			<Button className="round-button S" color="primary">S</Button>
		</div>

		<div className="action-buttons">
			<Button className="action-button" color="primary">Pick up</Button>
			<Button className="action-button" color="primary">Drop</Button>
		</div>
    </div>
  );
}

export default Sidebar;
