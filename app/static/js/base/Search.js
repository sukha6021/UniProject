class Search extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {
			'questions' : frontend_data.questions , 
			'next_url' : frontend_data.next_url , 
			'prev_url'  : frontend_data.prev_url, 
		}
	}

	render(){
		let questions = this.state.questions.map(question => <Question key = {question.id}question = {question}/>)
		return(
			<div>
				<h1>Search results</h1>
				{questions}
				<div>
					{this.state.prev_url ? <Anchor urlText="Newer results" url = {this.state.prev_url} /> :''}
					{this.state.next_url ? <Anchor urlText="Older results" url = {this.state.next_url} /> :''}
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<Search /> ,
	document.getElementById("search") 
	);