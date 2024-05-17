import { useEffect, useState } from "react";
import { useAuthStore } from "../../state/stores";
import { updateSettings } from "../../state/routes";
import { FlexColumn } from "../layout/Flex";
import { Subheading } from "../global/Text";
import TextInput from "../global/TextInput";
import Button from "../global/Button";

const ProfileDetails = ({ userData }) => {
  const authState = useAuthStore((state) => state.auth);
  const apiHeaders = { Authorization: `Token ${authState.token}` };
  const [profileData, setProfileData] = useState(false);
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
        console.log("res", res);
      },
      (err) => {
        setIsLoading(false);
        console.log("err");
      },
      apiHeaders
    );
  };

  return (
    <FlexColumn>
      <Subheading>Profile Details</Subheading>
      <FlexColumn
        style={{
          padding: 8,
          backgroundColor: "#EEEEEE",
          borderRadius: 4,
          maxWidth: "308px",
        }}
        gap={24}
      >
        <FlexColumn>
          <TextInput
            label="Email"
            value={userData?.email}
            error={errorState}
            errorTitleOverride={"username"}
            disabled={true}
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
        </FlexColumn>
        {/* //TODO convert to card styles */}
        <Button
          text={"Save"}
          onClick={() => updateProfile()}
          style={{ width: "100%" }}
          isLoading={isLoading}
        />
      </FlexColumn>
    </FlexColumn>
  );
};

export default ProfileDetails;
