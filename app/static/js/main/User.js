class User extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			current_user: frontend_data.current_user,
			messages: [],
			question: '',
			title: '',
			show_form: frontend_data.show_form , 
			questions: frontend_data.questions ,
			next_url : frontend_data.next_url,
			prev_url : frontend_data.prev_url,
			user: frontend_data.user,
			is_following: frontend_data.is_following
		};
	}

	componentDidMount() {

	}

	render(){
		let user = this.state.user;
		let questions = this.state.questions.map(q => <Question 
			key = {q.id}
			question = {q}
			 />);

		let link = user.username == this.state.current_user ?
    		<p><a href={user._links.edit_profile}>Edit your profile</a></p> 
    	: this.state.is_following ?
    		<p><a href={ user._links.unfollow }>Unfollow</a></p>
		:
    		<p><a href={ user._links.follow }>Follow</a></p>;
			
		return(
			<div>
				<UserMessages user_messages = {this.state.messages}/>
		        <div>
		            <div><img src={user._links.avatar}></img></div>
		            <div>
		                <h1>User: { user.username }</h1>
		                {user.about_me ? <p>{user.about_me}</p> : '' }	
		                {user.last_seen ? <p>Last seen on: {moment(user.last_seen).format('LLL')}</p> : ''}
		                {link}
					</div>
		        </div>
				<ul>
					{questions}
				</ul>
				<div>
					{this.state.prev_url ? <Anchor urlText="Newer questions" url = {this.state.prev_url} /> :''}
					{this.state.next_url ? <Anchor urlText="Older questions" url = {this.state.next_url} /> :''}
				</div>
		    </div>
		);
	}

}

ReactDOM.render( <User/> 
	, document.getElementById('user'));

