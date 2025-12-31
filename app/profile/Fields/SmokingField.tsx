import React from "react";
import { RadioButtonGroup } from "@nuralogix.ai/web-ui";
import FieldWrapper from "../FieldWrapper";
import { SmokingStatus } from "../types";
import { FORM_VALUES } from "../constants";

interface SmokingFieldProps {
  value: SmokingStatus;
  onChange: (value: SmokingStatus) => void;
}

const SmokingField: React.FC<SmokingFieldProps> = ({ value, onChange }) => {
  const smokingOptions = [
    { value: FORM_VALUES.SMOKER_TRUE, label: "Yes" },
    { value: FORM_VALUES.SMOKER_FALSE, label: "No" },
  ];

  const handleChange = (value: string) => {
    onChange(value as SmokingStatus);
  };

  return (
    <FieldWrapper>
      <RadioButtonGroup
        label={"Do you smoke?"}
        value={value}
        onChange={handleChange}
        options={smokingOptions}
      />
    </FieldWrapper>
  );
};

export default SmokingField;
