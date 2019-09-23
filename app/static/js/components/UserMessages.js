function UserMessages (props) {
	let user_messages = props.user_messages.map( (m,index )=> <li key={index}>{m}</li>)
	return(
		<ul style = { props.user_messages.length == 0 ? {display : 'hidden'} : null } >
			{user_messages}
		</ul>
	);
}