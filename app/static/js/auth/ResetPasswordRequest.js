class ResetPasswordRequest extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			email: '' , 
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
				temp_state['messages'][index][0] = handleMessage(field_name,temp_state['messages'][index][0]);	
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
			email: this.state.email , 
		}
		
		return(
			<div>
				<UserMessages user_messages = {this.state.messages}/>
				<h1>Reset Password</h1>
				<Form 
			    formData={formData} 
			    submitText= 'Request Password Reset' 
			    url="http://localhost:5000/auth/reset_password_request" 
			    handleResponse = {this.handleResponse}
			    >
			        <Input 
			        text = "Email:" 
			        name="email" 
			        value ={this.state.email} 
			        onChange = {this.handleInputChange} 
			        className = {this.state.email_error ?'error' : null}
			        onFocus = {this.onFocus}
			        />
				</Form>
			</div>
		);
	}

}

ReactDOM.render( <ResetPasswordRequest /> 
	, document.getElementById('reset_password_request'));

