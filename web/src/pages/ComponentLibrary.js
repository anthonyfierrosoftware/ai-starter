import { useState } from "react";
import { BodyText, Heading, Subheading } from "../components/global/Text";
import TextInput from "../components/global/TextInput";
import TextArea from "../components/global/TextArea";
import { FlexColumn } from "../components/layout/Flex";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/global/Button";
import TextLink from "../components/global/TextLink";
import RadioCheckbox from "../components/global/RadioInput";

const ComponentLibrary = ({}) => {
  const [textField, setTextField] = useState("");
  const [secretField, setSecretField] = useState("somesecret");
  const [textArea, setTextArea] = useState("");

  return (
    <PageLayout>
      <Heading>Component Library</Heading>
      <br />
      <br />
      <br />
      <FlexColumn gap={42}>
        <FlexColumn>
          <Subheading>Text Components</Subheading>
          <BodyText>Hello, this is the BodyText component.</BodyText>
          <Subheading>Hello, this is the Subheading component.</Subheading>
          <Heading>Hello, this is the Heading component.</Heading>
        </FlexColumn>

        <FlexColumn>
          <Subheading>Inputs</Subheading>
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
          <TextArea label="Text Area" value={textArea} setValue={setTextArea} />
        </FlexColumn>

        <FlexColumn>
          <Subheading>Button</Subheading>
          <Button text={"Click Me"} onClick={() => {}} />
        </FlexColumn>

        <FlexColumn>
          <Subheading>Text Link</Subheading>
          <TextLink>Click me.</TextLink>
        </FlexColumn>

        <FlexColumn>
          <Subheading>Radio Checkbox</Subheading>
          <RadioCheckbox
            options={["Single input", "Multi-input"]}
            onChange={(data) => {}}
            defaultValue={"Single input"}
          />
        </FlexColumn>
      </FlexColumn>
      <br />
      <br />
      <br />
    </PageLayout>
  );
};

export default ComponentLibrary;
