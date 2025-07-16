import ReactLoading from "react-loading";

export default function LoadingSpinner() {
    return (
        <div className="spinner-overlay">
            <div className="animated-gradient"></div>
            <ReactLoading type="spinningBubbles" color="#ffffff" height={80} width={80} />
        </div>
    );
}
