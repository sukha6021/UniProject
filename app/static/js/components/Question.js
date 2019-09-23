function Question (props) {
	return (
		<div>
			<div >
			    <div>
			    	<img src={props.question.author_avatar}></img>
		    	</div>
			   	<div>
			        <a href={props.question.author_url}>{props.question.author}</a>
			            asked { moment(props.question.timestamp).fromNow()}:
				    <a href={ props.question.question_url}>{props.question.title}</a>
			    	<div>
			    		{props.question.body}
			    	</div>
			    </div>
			</div>
		</div>
	);
}