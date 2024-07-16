// Standardized component that groups content together


const ContentBlock = ({ children, isCentered = false, isLast = false, isRow = false, ...props }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isRow ? "row" : "column",
        gap: "12px",
        alignItems: isCentered && "center", 
        marginTop: isLast && "auto", 
        width: "100%"
      }}>
        {children}
    </div>
  );
};

export default ContentBlock;