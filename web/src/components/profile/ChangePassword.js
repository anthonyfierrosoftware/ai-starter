import { useState } from "react";

import Button from "../global/Button";
import TextInput from "../global/TextInput";
import ContentBlock from "../layout/ContentBlock";
import ContentGroup from "../layout/ContentGroup";

import { changePassword } from "../../state/routes";
import { useAuthStore } from "../../state/stores";

const ChangePassword = ({ onSuccess = () => {} }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorState, setErrorState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const authState = useAuthStore((state) => state.auth);
  const apiHeaders = { Authorization: `Token ${authState.token}` };

  const executeChangePassword = () => {
    setIsLoading(true);
    changePassword(
      {
        old_password: currentPassword,
        password1: newPassword,
        password2: confirmPassword,
      },
      (res) => {
        onSuccess();
        setIsLoading(false);
      },
      (err) => {
        console.log("change password error", err);
        setErrorState(err?.response?.data?.data?.errors);
        setIsLoading(false);
      },
      apiHeaders
    );
  };

  return (
    <ContentGroup subheading={"Change Password"}>
      <ContentBlock>
        <TextInput
          label="Current Password"
          value={currentPassword}
          onChange={setCurrentPassword}
          error={errorState}
          errorTitleOverride={"Password"}
          secretField={true}
        />
        <ContentBlock isRow={true}>
          <TextInput
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            secretField={true}
            errorTitleOverride={"Password1"}
            error={errorState}
            isRow={true}
          />
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            secretField={true}
            isRow={true}
          />
        </ContentBlock>
        <Button
          text={"Save Changes"}
          onClick={() => executeChangePassword()}
          style={{ width: "100%" }}
          isLoading={isLoading}
        />
      </ContentBlock>
    </ContentGroup>
  );
};

export default ChangePassword;
