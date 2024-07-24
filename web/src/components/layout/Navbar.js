import { useNavigate } from "react-router-dom";
import { useAuthStore, useThemeStore } from "../../state/stores";
import Button from "../global/Button";
import { BodyText } from "../global/Text";
import TextLink from "../global/TextLink";
import { FlexRow } from "./Flex";

const Navbar = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { theme, setTheme, toggleTheme } = useThemeStore();
  return (
    <FlexRow
      style={{ backgroundColor: theme.backgroundColor, ...navbarStyles }}
    >
      <BodyText
        style={{ margin: "auto 0", cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <b>AI Web Starter</b>
      </BodyText>
      <FlexRow gap={24}>
        <ThemeToggler toggleTheme={toggleTheme} />
        <TextLink
          style={{ margin: "auto", fontSize: "14px" }}
          onClick={() => navigate("/component-library")}
        >
          Component Library
        </TextLink>
        <TextLink
          style={{ margin: "auto", fontSize: "14px" }}
          onClick={() => navigate("/settings")}
        >
          Settings
        </TextLink>
        <Button
          text={"Log out"}
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
          style={{ margin: "auto 0" }}
        />
      </FlexRow>
    </FlexRow>
  );
};

const navbarStyles = {
  borderBottom: "1px solid black",
  padding: "4px 20px",
  justifyContent: "space-between",
};

const ThemeToggler = ({ toggleTheme }) => {
  return (
    <div
      onClick={() => toggleTheme()}
      style={{
        width: 24,
        height: 24,
        border: "1px solid grey",
        borderRadius: 4,
        backgroundColor: "darkgray",
        cursor: "pointer",
        margin: "auto 0",
      }}
    ></div>
  );
};

export default Navbar;
