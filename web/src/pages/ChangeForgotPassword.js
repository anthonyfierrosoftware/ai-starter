import { useState } from "react";
import { BodyText, Heading } from "../components/global/Text";
import TextInput from "../components/global/TextInput";
import { FlexColumn } from "../components/layout/Flex";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/global/Button";
import ChangePassword from "../components/profile/ChangePassword";

const ChangeForgotPassword = ({}) => {
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorState, setErrorState] = useState(false);
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
