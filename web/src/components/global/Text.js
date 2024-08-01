import { useThemeStore } from "../../state/stores";

const Heading = ({ style, children, ...props }) => {
  const { theme } = useThemeStore();
  return (
    <h1 style={{ margin: 0, color: theme.textColor, ...style }}>{children}</h1>
  );
};

const Subheading = ({ style, children, ...props }) => {
  const { theme } = useThemeStore();
  return (
    <h3 style={{ margin: 0, color: theme.textColor, ...style }}>{children}</h3>
  );
};

const BodyText = ({
  style,
  children,
  isCentered = false,
  onClick = () => {},
}) => {
  const { theme } = useThemeStore();
  return (
    <p
      style={{
        margin: 0,
        textAlign: isCentered && "center",
        color: theme.textColor,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </p>
  );
};

const ErrorText = ({ style, children }) => {
  const { theme } = useThemeStore();
  return (
    <span style={{ color: theme.error, fontSize: "12px", ...style }}>
      {children}
    </span>
  );
};

export { Heading, Subheading, BodyText, ErrorText };
