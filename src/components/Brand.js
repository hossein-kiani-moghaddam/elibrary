
import {Image} from "react-bootstrap";
function Brand({...rest}){
	return (
		<h4 className="brand" {...rest} style={{
			color: "rgb(255, 201, 14)",
			textShadow: "1px 1px 1px #555"
		}}>
			<Image src="/images/elibrary.png" style={{width: "40px", height: "40px"}} />
			Electronic Books Library
		</h4>
	);
}

export default Brand;
