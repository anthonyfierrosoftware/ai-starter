import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { BodyText } from "../components/global/Text";
import TextInput from "../components/global/TextInput";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/global/Button";
import TextLink from "../components/global/TextLink";

import { login } from "../state/routes";
import { useAuthStore } from "../state/stores";
import ContentCard from "../components/layout/ContentCard";
import ContentBlock from "../components/layout/ContentBlock";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [errorState, setErrorState] = useState(false);

  const addCredentials = useAuthStore((state) => state.addCredentials);

  const executeLogin = () => {
    setIsLoading(true);
    login(
      { username: email, password },
      (res) => {
        setIsLoading(false);
        if (res.data?.data.profile.changeTempPassword === true) {
          addCredentials(res?.data?.data);
          window.location.href = "/change-forgot-password";
        }
        addCredentials(res?.data?.data);
        // window.location.href = "/";
      },
      (res) => {
        setIsLoading(false);
        setErrorState(res?.response?.data?.data?.error?.errorMessage);
      }
    );
  };

  return (
    <PageLayout displayNav={false} isCentered={true}>
      <ContentCard
        heading={"Your App Title Here"}
        subheading={"Login"}
        isCentered={true}
      >
        <ContentBlock>
          <TextInput
            label="Email"
            value={email}
            onChange={setEmail}
            error={errorState}
          />

          <TextInput
            label="Password"
            secretField={true}
            value={password}
            onChange={setPassword}
            error={errorState}
          />

          <Button
            text={"Login"}
            onClick={() => executeLogin()}
            isLoading={isLoading}
            style={{ width: "100%" }}
          />
        </ContentBlock>

        <ContentBlock isCentered={true} isLast={true}>
          <div style={{ display: "ruby" }}>
            <BodyText>Don't have an account?</BodyText>{" "}
            <TextLink onClick={() => navigate("/register")}>Register</TextLink>
          </div>

          <div style={{ display: "ruby" }}>
            <BodyText>Forgot your password?</BodyText>{" "}
            <TextLink onClick={() => navigate("/forgot-password")}>
              Reset my password
            </TextLink>
          </div>
        </ContentBlock>
      </ContentCard>
    </PageLayout>
  );
};

export default Login;
