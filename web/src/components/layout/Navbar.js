import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../state/stores";
import Button from "../global/Button";
import { BodyText } from "../global/Text";
import TextLink from "../global/TextLink";
import { FlexRow } from "./Flex";

const Navbar = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  return (
    <FlexRow style={{ justifyContent: "space-between", ...navbarStyles }}>
      <BodyText
        style={{ margin: "auto 0", cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <b>AI Web Starter</b>
      </BodyText>
      <FlexRow gap={24}>
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
};

export default Navbar;
