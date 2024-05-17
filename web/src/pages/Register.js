import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { BodyText, Heading, Subheading } from "../components/global/Text";
import TextInput from "../components/global/TextInput";
import { FlexColumn } from "../components/layout/Flex";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/global/Button";
import TextLink from "../components/global/TextLink";
import { register } from "../state/routes";
import { useAuthStore } from "../state/stores";

const Register = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [errorState, setErrorState] = useState(false);

  const addCredentials = useAuthStore((state) => state.addCredentials);

  const navigate = useNavigate();

  const executeRegister = () => {
    setIsLoading(true);
    register(
      { email, firstName, lastName, password, confirmPassword },
      (res) => {
        setIsLoading(false);
        addCredentials(res?.data?.data);
        window.location.href = "/";
      },
      (res) => {
        setIsLoading(false);
        setErrorState(res?.response?.data?.data?.errors);
      }
    );
  };

  return (
    <PageLayout displayNav={false}>
      <FlexColumn style={{ alignItems: "center" }} gap={24}>
        <Heading>Your App Title Here</Heading>

        <Subheading>Register</Subheading>

        <FlexColumn>
          <TextInput
            label="Email"
            value={email}
            onChange={setEmail}
            error={errorState}
            errorTitleOverride={"username"}
          />
          <TextInput
            label="First Name"
            value={firstName}
            onChange={setFirstName}
          />
          <TextInput
            label="Last Name"
            value={lastName}
            onChange={setLastName}
          />

          <br />
          <br />

          <TextInput
            label="Password"
            value={password}
            onChange={setPassword}
            error={errorState}
            errorTitleOverride={"password1"}
            secretField={true}
          />
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={errorState}
            errorTitleOverride={"password2"}
            secretField={true}
          />

          <br />
          <br />

          <Button
            text={"Register"}
            style={{ margin: "auto" }}
            onClick={() => executeRegister()}
            isLoading={isLoading}
          />
        </FlexColumn>

        <br />
        <br />

        <div style={{ display: "ruby" }}>
          <BodyText>Have an account?</BodyText>{" "}
          <TextLink onClick={() => navigate("/")}>Log in.</TextLink>
        </div>
        <br />
        <br />
      </FlexColumn>
    </PageLayout>
  );
};

export default Register;
