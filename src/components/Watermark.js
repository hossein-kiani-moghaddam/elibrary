
function Watermark({children, ...rest}){
	return (
		<div className="watermark" {...rest} style={{
			height: "100%",
		  backgroundImage: "url('http://localhost:3000/images/banner.jpg')",
		  backgroundRepeat: "no-repeat",
		  backgroundPosition: "center center",
		  backgroundSize: "cover",
		  backgroundAttachment: "fixed"
		}}>
			{children}
		</div>
	);
}

export default Watermark;
