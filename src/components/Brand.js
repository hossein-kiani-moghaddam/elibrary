
function Brand({...rest}){
	return (
		<h4 className="brand" {...rest} style={{
			color: "rgb(255, 201, 14)",
			textShadow: "1px 1px 1px #555"
		}}>
			Electronic Books Library
		</h4>
	);
}

export default Brand;
