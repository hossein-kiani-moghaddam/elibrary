
function Watermark({children, ...rest}){
	return (
		<div className="watermark" {...rest} style={{
			minHeight: "100%",
			backgroundImage: "url('/images/banner.jpg')",
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
