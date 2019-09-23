class Base extends React.Component{
	
	constructor(props){
		super(props);
		this.state = {
			messages : this.props.messages,
			search: '', 

		}
	}

	handleSearchRequest = (data) => {
		let url = "http://localhost:5000/main/search?q="; 
		url += data.q;
		fetch( url, {
			headers: {
				"X-CSRFToken": csrf_token,
		    }, 
		}).then(response => {
			window.location.replace(response.url);
		});
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
			q: this.state.search
		};
		let links  = this.props.links;
  		let link_elements = Object.keys(links).map(link => <Link  key={link} href={links[link]} link_name={link}/>);
  		return(
			<div>
				<div>
					<span> Q&A Engine </span>
					{link_elements}
					<Form 
					className = "search-element"
				    formData={formData} 
				    submitText= 'Search' 
				    url={"http://localhost:5000/main/search"} 
				   	handleRequest = {(formData) => this.handleSearchRequest(formData)}
				    >
				        <Input 
				        palceholder = "Search" 
				        name="search"
	 			        value ={this.state.search} 
				        onChange = {this.handleInputChange} 
				        className = {this.state.username_error ?'error' : null}
				        onFocus = {this.onFocus}
				        />
				    </Form>
				</div>
				<UserMessages user_messages = {this.state.messages}/>
			</div>
		);
	}
}

function Link (props) {
	return <a href = {props.href} >{props.link_name}</a>;
} 

ReactDOM.render( <Base 
	links = {frontend_data.nav_links} 
	messages = {frontend_data.messages}  /> 
	, document.getElementById('base'));