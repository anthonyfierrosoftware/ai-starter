const FlexColumn = ({ gap = 8, children, style, ...props }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: `${gap}px`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const FlexRow = ({ gap = 8, children, style, ...props }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: `${gap}px`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export { FlexColumn, FlexRow };
