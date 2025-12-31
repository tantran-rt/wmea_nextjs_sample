import React from "react";
import { RadioButtonGroup } from "@nuralogix.ai/web-ui";
import FieldWrapper from "../FieldWrapper";
import { DiabetesStatus } from "../types";
import { FORM_VALUES } from "../constants";

interface DiabetesStatusFieldProps {
  value: DiabetesStatus;
  onChange: (value: DiabetesStatus) => void;
}

const DiabetesStatusField: React.FC<DiabetesStatusFieldProps> = ({
  value,
  onChange,
}) => {
  const diabetesStatusOptions = [
    { value: FORM_VALUES.DIABETES_TYPE1, label: "Type 1" },
    { value: FORM_VALUES.DIABETES_TYPE2, label: "Type 2" },
    { value: FORM_VALUES.DIABETES_NONE, label: "No" },
  ];

  const handleChange = (value: string) => {
    onChange(value as DiabetesStatus);
  };

  return (
    <FieldWrapper>
      <RadioButtonGroup
        label={"Are you diabetic?"}
        value={value}
        onChange={handleChange}
        options={diabetesStatusOptions}
      />
    </FieldWrapper>
  );
};

export default DiabetesStatusField;
