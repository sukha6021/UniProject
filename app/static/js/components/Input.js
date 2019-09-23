function Input(props){
	return(
		<div className="input-container">
			<label htmlFor={props.name}>{props.text}</label>
			<input 
			id= {props.name}
			className={props.className}
			type = {props.type ? props.type: "text"}
			name={props.name} 
			value = {props.value}
			onChange={props.onChange}
			onFocus= {props.onFocus}
			placeholder = {props.placeholder}/>
		</div>
	);
}