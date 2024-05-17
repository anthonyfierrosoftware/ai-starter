import { useEffect, useState } from "react";
import { Heading, Subheading } from "../components/global/Text";
import { FlexColumn, FlexRow } from "../components/layout/Flex";
import PageLayout from "../components/layout/PageLayout";
import {
  changePassword,
  fetchProfileData,
  updateSettings,
} from "../state/routes";
import { useAuthStore } from "../state/stores";
import TextInput from "../components/global/TextInput";
import Button from "../components/global/Button";
import ChangePassword from "../components/profile/ChangePassword";
import ProfileDetails from "../components/profile/ProfileDetails";

const Settings = ({}) => {
  const [fetchedProfile, setFetchedProfile] = useState();
  const authState = useAuthStore((state) => state.auth);
  const apiHeaders = { Authorization: `Token ${authState.token}` };

  useEffect(() => {
    fetchProfileData(
      (res) => {
        console.log("res", res);
        setFetchedProfile(res?.data?.data?.userData);
      },
      (err) => {
        console.log("err", err);
      },
      apiHeaders
    );
  }, []);

  return (
    <PageLayout>
      <FlexColumn gap={32}>
        <Heading>Settings</Heading>
        <FlexRow style={{ flexWrap: "wrap" }}>
          <ProfileDetails
            authState={authState}
            userData={fetchedProfile}
            apiHeaders={apiHeaders}
          />
          <ChangePassword apiHeaders={apiHeaders} />
        </FlexRow>
      </FlexColumn>
    </PageLayout>
  );
};

export default Settings;
