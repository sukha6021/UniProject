function Textarea(props){
	return(
		<div className="textarea-container">
			<label htmlFor={props.name}>{props.text}</label>
			<textarea 
			id= {props.name}
			className={props.className}
			type = {props.type ? props.type: "text"}
			name={props.name} 
			value = {props.value}
			onChange={props.onChange}
			onFocus= {props.onFocus}/>
		</div>
	);
}