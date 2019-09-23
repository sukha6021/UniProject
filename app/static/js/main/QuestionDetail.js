class QuestionDetail extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			messages: [],
			answer: frontend_data.answer , 
			answers: frontend_data.answers ,
			next_url : frontend_data.next_url,
			prev_url : frontend_data.prev_url,
			question : frontend_data.question, 
			current_user : frontend_data.current_user,
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

  	onAnswerChoice = (id) => {
  		const data = {
			answer_id : id , 
			question_id: this.state.question.id,	
		}; 
		let formData = new FormData(); 
		Object.keys(data).forEach(key => formData.append(key , data[key]));
		 
		fetch("http://localhost:5000/main/update_answer"  , {
			method : 'POST',
			headers: {
				"X-CSRFToken": csrf_token,
			}, 
			body: formData,
		}).then(response => response.json())
		.then(response => {
			let temp_answers  = this.state.answers;
			response.answers.forEach( a => {
				let update_answer = temp_answers.find(answer => answer.id == a.id);
				update_answer.is_best = a.is_best;
			});
			this.setState({answers: temp_answers});
		});		
		
  	}

	render(){
		let formData = {
			answer: this.state.answer , 
			}
		let  answers = this.state.answers.map(a => 
			<Answer 
				key = {a.id}
				answer = {a} 
				name = {this.state.question.id}
				onCheck = {this.state.current_user == this.state.question.author ?  this.onAnswerChoice : null}
				/>);

		return(
			<div>
				<UserMessages user_messages = {this.state.messages}/>
				<Question question = {this.state.question} />
				<Form 
			    formData={formData} 
			    submitText= 'Submit' 
			    url={"http://localhost:5000/main/question_detail/" + this.state.question.id } 
			    handleResponse = {this.handleResponse}
			    >
			        <Textarea 
			        text = "Leave Your Answer" 
			        name="answer"
			        value ={this.state.answer} 
			        onChange = {this.handleInputChange} 
			        className = {this.state.answer_error ?'error' : null}
			        onFocus = {this.onFocus}
			        />
				</Form>
				<ul>
					{answers}
				</ul>
				<div>
					{this.state.prev_url ? <Anchor urlText="Newer answers" url = {this.state.prev_url} /> :''}
					{this.state.next_url ? <Anchor urlText="Older answers" url = {this.state.next_url} /> :''}
				</div>
			</div>
		);
	}

}

ReactDOM.render( <QuestionDetail /> 
	, document.getElementById('question_detail'));

