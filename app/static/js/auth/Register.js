class Register extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			username: '' , 
			email: '',
			password: '',
			password2: '' , 
			remember_me: false,
			messages: []
		};
	}

	componentDidMount() {

	}

	handleResponse = (response) => {
		console.log(response);
		if(response.status != 400)  return window.location.replace(response.url)  
		
		response = response.json().then(
			response => {

			var temp_state = {};
		  	temp_state['messages'] = response.messages ? response.messages : [];
			response.errors.forEach((field_name,index) => {
				temp_state[field_name + "_error"] = true;
				temp_state['messages'][index][0] = handleMessage(field_name,temp_state['messages'][index][0]);	
		  	});
			this.setState(temp_state);	
			}
		)
	}
	
	handleInputChange = (event) => {
	    const target = event.target;
		const name = target.name;

	    this.setState({
	      [name]: target.value
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
			email: this.state.email, 
			password: this.state.password,
			password2: this.state.password2,
		}
		
		return(
			<div>
				<UserMessages user_messages = {this.state.messages}/>
				<h1>Register</h1>
				<Form 
			    formData={formData} 
			    submitText= 'Register' 
			    url="http://localhost:5000/auth/register" 
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
			        text = "Email:" 
			        name="email" 
			        value ={this.state.email} 
			        onChange = {this.handleInputChange} 
			        className = {this.state.email_error ?'error' : null}
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
			       	<Input 
			        text = "Repeat password:" 
			        type = "password"
			        name="password2" 
			        value ={this.state.password2} 
			        onChange = {this.handleInputChange} 
			        className = {this.state.password2_error ? 'error' : null}
			       	onFocus = {this.onFocus}
			       	/>
					
				</Form>
			</div>
		);
	}

}

ReactDOM.render( <Register /> 
	, document.getElementById('register'));