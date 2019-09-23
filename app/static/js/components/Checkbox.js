function Checkbox(props){
	return(
		<div className={props.className ? props.className + " checkbox" : "checkbox"}>
			<input 
			id= {props.name}
			name = "remember_me" 
			type="checkbox" 
			checked={props.checked}
		 	onChange={props.onChange}/> 
		 	<label htmlFor={props.name}>{props.text}</label>
		</div>
			        
	);
}
