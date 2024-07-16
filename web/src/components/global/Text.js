const Heading = ({ style, children, ...props }) => {
  return <h1 style={{ margin: 0, ...style }}>{children}</h1>;
};

const Subheading = ({ style, children, ...props }) => {
  return <h3 style={{ margin: 0, ...style }}>{children}</h3>;
};

const BodyText = ({ style, children, isCentered = false, onClick = () => {} }) => {
  return (
    <p style={{ margin: 0, textAlign: isCentered && "center", ...style }} onClick={onClick}>
      {children}
    </p>
  );
};

const ErrorText = ({style, children}) => {
  return (
    <span style={{ color: "red", fontSize: "12px", ...style }}>{children}</span>
  )
}

export { Heading, Subheading, BodyText, ErrorText };
