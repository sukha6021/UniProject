class Form extends React.Component{
	constructor(props){
		super(props);
	}

	handleSubmit = () => {
		event.preventDefault();
		
		if (this.props.handleRequest)  {
			this.props.handleRequest(this.props.formData)
			return;
		}
		
		let formData = new FormData(); 
		let component = this;
		Object.keys(this.props.formData).forEach(key => formData.append(key , this.props.formData[key]));

		fetch(component.props.url , {
			method : 'POST',
			headers: {
				"X-CSRFToken": csrf_token,
		    }, 
			body: formData,
		}).then(response => {
			this.props.handleResponse(response);
		});

	}

	render(){
		return(
			<div style ={this.props.style} >
				{this.props.children}
				<button 
				className = "submit-button" 
				onClick = {this.handleSubmit}>
				{this.props.submitText}</button>
			</div>
		);
	}
}