function Answer (props) {
	var radio_button = 
		props.onCheck ? <input 
			type="radio" 
			id ={ props.answer.id} 
			onChange = {() => props.onCheck(props.answer.id)} 
			checked = {props.answer.is_best} 
			name = {props.name}></input> 
			: <span 
				style={{ display : props.answer.is_best ? 'inline' : 'none'} } 
			>This is the best answer</span>;
	return (
		<div className = 'answer-container'>
			<div >
			    <div>
			    	<img src = {props.answer.author_avatar}></img>
			    	{radio_button}
		    	</div>
			   	<div>
			        <a href={props.answer.author_url}>{props.answer.author}</a>
		                { moment(props.answer.timestamp).fromNow()}:
				    <div>
			    		{props.answer.body}
			    	</div>
			    </div>
			</div>
		</div>
	);
}