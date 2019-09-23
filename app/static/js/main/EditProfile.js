class EditProfile extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			username: frontend_data.username , 
			about_me: frontend_data.about_me ? frontend_data.about_me : '' ,
			messages: [],
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
			username: this.state.username , 
			about_me: this.state.about_me ,
		}
		
		return(
			<div>
				<UserMessages user_messages = {this.state.messages}/>
				<Form 
			    formData={formData} 
			    submitText= 'Submit' 
			    url={"http://localhost:5000/main/edit_profile"} 
			    handleResponse = {this.handleResponse}
			    >
			        <Input 
			        text = "Username" 
			        name="username"
 			        value ={this.state.username} 
			        onChange = {this.handleInputChange} 
			        className = {this.state.username_error ?'error' : null}
			        onFocus = {this.onFocus}
			        />
			        <Textarea 
			        text = "About me" 
			        name="about_me"
			        value ={this.state.about_me} 
			        onChange = {this.handleInputChange} 
			        className = {this.state.about_me_error ?'error' : null}
			        onFocus = {this.onFocus}
			        />
				</Form>
			</div>
		);
	}

}

ReactDOM.render( <EditProfile /> 
	, document.getElementById('edit_profile'));

