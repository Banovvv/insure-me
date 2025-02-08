export const ProgressBar = ({ progress }: { progress: number }) => {
    return (
        <div style={{
            width: "100%",
            height: "20px",
            backgroundColor: "#e0e0e0",
            borderRadius: "10px",
            overflow: "hidden",
            position: "relative"
        }}>
            <div
                style={{
                    width: `${progress}%`,
                    height: "100%",
                    background: "linear-gradient(to right, #59C173, #a17fe0, #5D26C1)",
                    transition: "width 0.3s ease-in-out"
                }}
            />
            <span
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#fff"
                }}>
                {Math.round(progress)}%
            </span>
        </div>
    );
};
