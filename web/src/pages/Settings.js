import { useEffect, useState } from "react";

import { Heading } from "../components/global/Text";
import PageLayout from "../components/layout/PageLayout";
import ChangePassword from "../components/profile/ChangePassword";
import ProfileDetails from "../components/profile/ProfileDetails";
import { FlexColumn } from "../components/layout/Flex";

import { fetchProfileData } from "../state/routes";
import { useAuthStore } from "../state/stores";

const Settings = () => {
  const [fetchedProfile, setFetchedProfile] = useState();
  const authState = useAuthStore((state) => state.auth);
  const apiHeaders = { Authorization: `Token ${authState.token}` };

  useEffect(() => {
    fetchProfileData(
      (res) => {
        setFetchedProfile(res?.data?.data?.userData);
      },
      (err) => {
        console.log("profile data fetch error", err);
      },
      apiHeaders
    );
  }, []);

  return (
    <PageLayout>
      <FlexColumn style={{ padding: 16 }} gap={32}>
        <Heading>Settings</Heading>
        <ProfileDetails
          authState={authState}
          userData={fetchedProfile}
          apiHeaders={apiHeaders}
        />
        <ChangePassword apiHeaders={apiHeaders} />
      </FlexColumn>
    </PageLayout>
  );
};

export default Settings;
