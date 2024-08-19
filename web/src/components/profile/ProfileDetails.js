import { useEffect, useState } from "react";
import { useAuthStore } from "../../state/stores";
import { updateSettings } from "../../state/routes";

import ContentBlock from "../layout/ContentBlock";
import TextInput from "../global/TextInput";
import Button from "../global/Button";
import ContentGroup from "../layout/ContentGroup";

const ProfileDetails = ({ userData }) => {
  const authState = useAuthStore((state) => state.auth);
  const apiHeaders = { Authorization: `Token ${authState.token}` };
  const [firstName, setFirstName] = useState(userData?.first_name || "");
  const [lastName, setLastName] = useState(userData?.last_name || "");

  useEffect(() => {
    setFirstName(userData?.first_name || "");
    setLastName(userData?.last_name || "");
  }, [userData]);

  const [isLoading, setIsLoading] = useState();

  const [errorState, setErrorState] = useState(false);

  const updateProfile = () => {
    setIsLoading(true);
    updateSettings(
      { first_name: firstName, last_name: lastName },
      (res) => {
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
        console.log("update profile error");
      },
      apiHeaders
    );
  };

  return (
    <ContentGroup subheading={"Profile Details"}>
      <ContentBlock>
        <TextInput
          label="Email"
          value={userData?.email}
          error={errorState}
          errorTitleOverride={"username"}
          disabled={true}
        />
        <ContentBlock isRow={true}>
          <TextInput
            label="First Name"
            value={firstName}
            onChange={setFirstName}
            isRow={true}
          />
          <TextInput
            label="Last Name"
            value={lastName}
            onChange={setLastName}
            isRow={true}
          />
        </ContentBlock>
        <Button
          text={"Save Changes"}
          onClick={() => updateProfile()}
          style={{ width: "100%" }}
          isLoading={isLoading}
        />
      </ContentBlock>
    </ContentGroup>
  );
};

export default ProfileDetails;
