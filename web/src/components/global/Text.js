const Heading = ({ style, children, ...props }) => {
  return <h1 style={{ margin: 0, ...style }}>{children}</h1>;
};

const Subheading = ({ style, children, ...props }) => {
  return <h3 style={{ margin: 0, ...style }}>{children}</h3>;
};

const BodyText = ({ style, children, onClick = () => {} }) => {
  return (
    <p style={{ margin: 0, ...style }} onClick={onClick}>
      {children}
    </p>
  );
};

export { Heading, Subheading, BodyText };
