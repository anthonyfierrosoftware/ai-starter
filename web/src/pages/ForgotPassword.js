import { useState } from "react";

import PageLayout from "../components/layout/PageLayout";
import { BodyText } from "../components/global/Text";
import TextInput from "../components/global/TextInput";
import Button from "../components/global/Button";
import TextLink from "../components/global/TextLink";
import ContentCard from "../components/layout/ContentCard";
import ContentBlock from "../components/layout/ContentBlock";

import { resetPassword } from "../state/routes";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isReset, setIsReset] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onResetPassword = () => {
    setIsLoading(true);
    resetPassword(
      email,
      (res) => {
        setIsLoading(false);
        setIsReset(true);
      },
      (err) => {
        console.log("reset password error", err);
        setIsLoading(false);
        setErrorState([...err?.response?.data?.data?.errors]);
      }
    );
  };

  return (
    <PageLayout displayNav={false} isCentered={true}>
      {isReset ? (
        <ContentCard heading={"Password Reset"} isCentered={true}>
          <ContentBlock isCentered={true}>
            <BodyText isCentered={true}>
              Check your email to set your new password
            </BodyText>
          </ContentBlock>
          <ContentBlock isCentered={true} isLast={true}>
            <TextLink
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Go home
            </TextLink>
          </ContentBlock>
        </ContentCard>
      ) : (
        <ContentCard heading={"Forgot Password"} isCentered={true}>
          <ContentBlock isCentered={true}>
            <BodyText isCentered={true}>
              Enter your email below to reset your password
            </BodyText>
          </ContentBlock>
          <ContentBlock isCentered={true}>
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
              style={{ width: "100%" }}
            />
          </ContentBlock>
          <ContentBlock isCentered={true} isLast={true}>
            <TextLink
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Go home
            </TextLink>
          </ContentBlock>
        </ContentCard>
      )}
    </PageLayout>
  );
};

export default ForgotPassword;
