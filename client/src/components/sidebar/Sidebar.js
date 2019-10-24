import React from 'react';
import './Sidebar.scss';
import { Button } from 'reactstrap';
import axiosWithAuth from '../../helpers/axiosWithAuth.js';
import mapData from '../../helpers/map'

const baseUrl = 'https://lambda-treasure-hunt.herokuapp.com';

class Sidebar extends React.Component {
	constructor() {
		super();
		this.state = {
			room: {
				room_id: 0,
				title: '',
				description: '',
				terrain: '',
				elevation: 0,
				cooldown: 0,
				messages: [],
				items: [],
				exits: [],
				errors: [],
				n: null,
				e: null,
				s: null,
				w: null
			}

		}
	}

	async componentDidMount() {
		this.init()
	}

	init = async () => {
		const response = await axiosWithAuth().get(`${baseUrl}/api/adv/init/`)
        let room = mapData[response.data.room_id]
		this.setState({
			room: {...response.data,
			 	n: room.n,
				e: room.e,
				w: room.w,
				s: room.s
			}
      	});
      	console.log('init', this.state.room)
	}

	move = async (direction) => {
		const moveRes = await axiosWithAuth().post(`${baseUrl}/api/adv/move/`, {
          "direction": direction,
          "next_room_id": this.state.room[direction].toString()
        })
        let room = mapData[moveRes.data.room_id]
        this.setState({
			room: {...moveRes.data,
				n: room.n,
				e: room.e,
				w: room.w,
				s: room.s
			} 
      	});
      	console.log('move', this.state.room)
	}

	render() {
		return (
			<div className="Sidebar pannel">
				<div className="translucent"></div>

				<div className="console">
					<p>Room #{this.state.room.room_id} :  {this.state.room.title}</p>
					<p>Description: {this.state.room.description}</p>
					<p>Message: {this.state.room.message}</p>
					<p>Item: {this.state.room.items[0]}</p>
					<p>Item: {this.state.room.items[1]}</p>
					<p>Item: {this.state.room.items[2]}</p>
					<p>Cooldown: {this.state.room.cooldown}</p>
				</div>



				<div className="dpad">
					<Button 
						className="round-button N" 
						color="primary"
						onClick={() => this.move('n')}
					>N</Button>
					<div className="center">
						<Button 
							className="round-button W" 
							color="primary"
							onClick={() => this.move('w')}
						>W</Button>
						<Button 
							className="round-button E" 
								color="primary"
							onClick={() => this.move('e')}
						>E</Button>
					</div>
					<Button 
						className="round-button S" 
						color="primary"
						onClick={() => this.move('s')}
					>S</Button>
				</div>



				<div className="action-buttons">
					<Button className="action-button" color="primary">Pick up</Button>
					<Button className="action-button" color="primary">Drop</Button>
				</div>
			</div>
		);
	}
}

export default Sidebar;
