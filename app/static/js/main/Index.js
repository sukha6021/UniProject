class Index extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			user: frontend_data.current_user,
			messages: [],
			question: '',
			title: '',
			show_form: frontend_data.show_form , 
			questions: frontend_data.questions ,
			next_url : frontend_data.next_url,
			prev_url : frontend_data.prev_url,
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
			title: this.state.title,
			question: this.state.question,
		}
		let questions = this.state.questions.map(q => <Question 
			key = {q.id}
			question = {q}
			 />);
			
		return(
			<div>
				<UserMessages user_messages = {this.state.messages}/>
				<h1>Hi, {this.state.user}!</h1>
				<Form 
			    formData={formData} 
			    submitText= 'Ask!' 
			    url="http://localhost:5000/main/index" 
			    handleResponse = {this.handleResponse}
			    style={{display: this.state.show_form ? 'block' : 'none' }}
			    >
			        <Input 
			        text = "Title:" 
			        name="title" 
			        value ={this.state.title} 
			        onChange = {this.handleInputChange} 
			        className = {this.state.title_error ?'error' : null}
			        onFocus = {this.onFocus}
			        />
			        <Textarea 
			        text = "Your Question:" 
			        name="question" 
			        value ={this.state.question} 
			        onChange = {this.handleInputChange} 
			        className = {this.state.question_error ?'error' : null}
			        onFocus = {this.onFocus}
			        />
				</Form>
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

ReactDOM.render( <Index /> 
	, document.getElementById('index'));

