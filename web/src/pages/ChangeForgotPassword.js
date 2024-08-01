import { BodyText, Heading } from "../components/global/Text";
import { FlexColumn } from "../components/layout/Flex";
import PageLayout from "../components/layout/PageLayout";
import ChangePassword from "../components/profile/ChangePassword";

const ChangeForgotPassword = () => {
  return (
    <PageLayout displayNav={false}>
      <FlexColumn style={{ alignItems: "center" }}>
        <Heading>Change Password</Heading>
        <BodyText>Set a new password below.</BodyText>
        <br />
        <br />
        <br />
        <ChangePassword
          onSuccess={() => {
            window.location.href = "/";
          }}
        />
      </FlexColumn>
    </PageLayout>
  );
};

export default ChangeForgotPassword;
