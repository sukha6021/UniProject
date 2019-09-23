function Anchor(props) {	
	return(
		<div className = "link" >
            <span>{props.preText}</span>
            <a href={props.url}>{props.urlText}</a>
        </div>
	);
}