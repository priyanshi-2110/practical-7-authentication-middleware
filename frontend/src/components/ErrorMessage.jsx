function ErrorMessage({ message }) {
    return (
        <div style={{ color: "red", textAlign: "center" }}>
            <h3>{message}</h3>
        </div>
    );
}

export default ErrorMessage;