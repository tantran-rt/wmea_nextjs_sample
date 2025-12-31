import React from "react";
import { RadioButtonGroup } from "@nuralogix.ai/web-ui";
import FieldWrapper from "../FieldWrapper";
import { Sex } from "../types";
import { FORM_VALUES } from "../constants";

interface SexSelectorProps {
  value: Sex;
  onChange: (value: Sex) => void;
}

const SexSelector: React.FC<SexSelectorProps> = ({ value, onChange }) => {
  const sexOptions = [
    { value: FORM_VALUES.MALE, label: "Male" },
    { value: FORM_VALUES.FEMALE, label: "Female" },
  ];

  const handleChange = (value: string) => {
    onChange(value as Sex);
  };

  return (
    <FieldWrapper>
      <RadioButtonGroup
        direction="row"
        label={"Sex at birth"}
        value={value}
        onChange={handleChange}
        options={sexOptions}
      />
    </FieldWrapper>
  );
};

export default SexSelector;
