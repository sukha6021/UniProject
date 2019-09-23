class ResetPasswordRequest extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			password: '' , 
			password2:'' ,
			messages: [],
			token: frontend_data.token
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
				temp_state['messages'][index][0] = handleMessage(field_name,temp_state['messages'][index][0]);	
			});

		  	this.setState(temp_state);	
			}
		)
	}
	
	handleInputChange = (event) => {
	    const target = event.target;
	    const value = target.value;
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
			password: this.state.password , 
			password2:this.state.password2 ,
		}
		
		return(
			<div>
				<UserMessages user_messages = {this.state.messages}/>
				<h1>Reset Your Password</h1>
				<Form 
			    formData={formData} 
			    submitText= 'Request Password Reset' 
			    url={"http://localhost:5000/auth/reset_password/" + this.state.token} 
			    handleResponse = {this.handleResponse}
			    >
			        <Input 
			        text = "Password:" 
			        name="password"
			        type="password" 
			        value ={this.state.password} 
			        onChange = {this.handleInputChange} 
			        className = {this.state.password_error ?'error' : null}
			        onFocus = {this.onFocus}
			        />
			        <Input 
			        text = "Repeat Password" 
			        name="password2"
			        type="password" 
			        value ={this.state.password2} 
			        onChange = {this.handleInputChange} 
			        className = {this.state.password2_error ?'error' : null}
			        onFocus = {this.onFocus}
			        />
				</Form>
			</div>
		);
	}

}

ReactDOM.render( <ResetPasswordRequest /> 
	, document.getElementById('reset_password'));

