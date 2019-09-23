class Login extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			username: '' , 
			password: '',
			remember_me: false,
			register_url : frontend_data.register_url, 
			reset_url : frontend_data.reset_url,
			messages: []
		};
	}

	componentDidMount() {

	}

	handleResponse = (response) => {
		if(response.status != 400)  return window.location.replace(response.url)  
		response = response.json().then(
			response => {
			var temp_state = {};
		  	temp_state['messages'] = response.messages ? response.messages : [];
			response.errors.forEach((field_name,index )=> {
				temp_state[field_name + "_error"] = true;
			});
			this.setState(temp_state);	
			}
		)	
	}
	
	handleInputChange = (event) => {
	    const target = event.target;
	    const value = target.type === 'checkbox' ? target.checked : target.value;
	    const name = target.name;

	    this.setState({
	      [name]: value
    	});
  	}

  	onFocus = (event) => {
  		const target = event.target;
	    const name = target.name;

	    this.setState({
	      [name + "_error"]: false
    	});
  	}

	render(){
		let formData = {
			username: this.state.username , 
			password: this.state.password,
			remember_me: this.state.remember_me
		}
		
		return(
			<div>
				<UserMessages user_messages = {this.state.messages}/>
				<h1>Sign In</h1>
				<Anchor 
				preText = "New User?"
				urlText = "Click to Register!"
				url = {this.state.register_url}
				/>
			    <Form 
			    formData={formData} 
			    submitText= 'Login' 
			    url="http://localhost:5000/auth/login" 
			    handleResponse = {this.handleResponse}
			    >
			        <Input 
			        text = "Username:" 
			        name="username" 
			        value ={this.state.username} 
			        onChange = {this.handleInputChange} 
			        className = {this.state.username_error ?'error' : null}
			        onFocus = {this.onFocus}
			        />
			        <Input 
			        text = "Password:" 
			        type = "password"
			        name="password" 
			        value ={this.state.password} 
			        onChange = {this.handleInputChange} 
			        className = {this.state.password_error ? 'error' : null}
			       	onFocus = {this.onFocus}
			       	/>
					<Checkbox
					text = "Remember me"	
					checked = {this.state.remember_me}
					onChange = {this.handleInputChange}
					/>
					<Anchor 
					preText = "Forgot Your Password?"
					urlText = "Click to Reset It"
					url = {this.state.reset_url}
					/>
				</Form>
			</div>
		);
	}

}

ReactDOM.render( <Login /> 
	, document.getElementById('login'));