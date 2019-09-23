function customizeMessage (key ,value){
	return capitalize(key) + " " + value.split(" ").slice(2).join(" "); 
}

function handleMessage(field_name,message){
	return message.startsWith("This field") ? customizeMessage(field_name , message) : message
}

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}