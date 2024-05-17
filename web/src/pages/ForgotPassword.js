import { useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import { Heading, Subheading } from "../components/global/Text";
import { FlexColumn } from "../components/layout/Flex";
import TextInput from "../components/global/TextInput";
import Button from "../components/global/Button";
import { resetPassword } from "../state/routes";
import TextLink from "../components/global/TextLink";

const ForgotPassword = ({}) => {
  const [email, setEmail] = useState("");
  const [isReset, setIsReset] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onResetPassword = () => {
    setIsLoading(true);
    resetPassword(
      email,
      (res) => {
        console.log("res", res);
        setIsLoading(false);
        setIsReset(true);
      },
      (err) => {
        console.log("err", err);
        setIsLoading(false);
        setErrorState([...err?.response?.data?.data?.errors]);
      }
    );
  };

  return (
    <PageLayout displayNav={false}>
      <Heading>Forgot Password</Heading>
      <br />
      <br />
      {isReset ? (
        <FlexColumn>
          <Subheading>
            Your password has been successfully reset. Check your email to set
            your new password.
          </Subheading>
          <TextLink
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Go home.
          </TextLink>
        </FlexColumn>
      ) : (
        <FlexColumn style={{ margin: "auto", alignItems: "center" }} gap={24}>
          <Subheading>
            Enter your email below to reset your password.
          </Subheading>
          <TextInput
            value={email}
            label="Email address"
            onChange={setEmail}
            error={errorState}
            errorTitleOverride="Email"
          />
          <Button
            text="Submit"
            onClick={() => onResetPassword()}
            isLoading={isLoading}
          />
        </FlexColumn>
      )}
    </PageLayout>
  );
};

export default ForgotPassword;
