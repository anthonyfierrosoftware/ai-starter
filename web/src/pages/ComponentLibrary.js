import { useState } from "react";
import { BodyText, Heading, Subheading } from "../components/global/Text";
import TextInput from "../components/global/TextInput";
import TextArea from "../components/global/TextArea";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/global/Button";
import TextLink from "../components/global/TextLink";
import RadioCheckbox from "../components/global/RadioInput";
import ContentGroup from "../components/layout/ContentGroup";
import ContentBlock from "../components/layout/ContentBlock";
import { FlexColumn } from "../components/layout/Flex";

const ComponentLibrary = () => {
  const [textField, setTextField] = useState("");
  const [secretField, setSecretField] = useState("somesecret");
  const [textArea, setTextArea] = useState("");

  return (
    <PageLayout>
      <FlexColumn gap={20} style={{ paddingLeft: 20, paddingTop: 20 }}>
        <Heading>Component Library</Heading>
        <ContentGroup subheading={"Text Components"}>
          <ContentBlock>
            <Heading>Hello, this a Heading.</Heading>
            <Subheading>Hello, this is the Subheading component.</Subheading>
            <BodyText>Hello, this is Body Text.</BodyText>
          </ContentBlock>
        </ContentGroup>

        <ContentGroup subheading={"Inputs"}>
          <ContentBlock>
            <TextInput
              label="Text Field"
              value={textField}
              onChange={setTextField}
            />
            <TextInput label="Disabled Text Field" value={"Static Value"} />
            <TextInput
              label="Secret Field"
              value={secretField}
              onChange={setSecretField}
              secretField={true}
            />
            <TextArea
              label="Text Area"
              value={textArea}
              setValue={setTextArea}
            />
          </ContentBlock>
        </ContentGroup>

        <ContentGroup subheading={"Interactives"}>
          <ContentBlock>
            <Button text={"Button"} onClick={() => {}} />
            <TextLink>Text link</TextLink>
            <RadioCheckbox
              options={["Radio", "Button"]}
              onChange={(data) => {}}
              defaultValue={"Radio"}
            />
          </ContentBlock>
        </ContentGroup>
      </FlexColumn>
    </PageLayout>
  );
};

export default ComponentLibrary;
