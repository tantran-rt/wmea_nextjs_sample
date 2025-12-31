import React from "react";
import { RadioButtonGroup } from "@nuralogix.ai/web-ui";
import FieldWrapper from "../FieldWrapper";
import { BloodPressureMedStatus } from "../types";
import { FORM_VALUES } from "../constants";

interface BloodPressureMedFieldProps {
  value: BloodPressureMedStatus;
  onChange: (value: BloodPressureMedStatus) => void;
}

const BloodPressureMedField: React.FC<BloodPressureMedFieldProps> = ({
  value,
  onChange,
}) => {
  const bloodPressureMedOptions = [
    { value: FORM_VALUES.BLOOD_PRESSURE_MEDICATION_TRUE, label: "YES" },
    { value: FORM_VALUES.BLOOD_PRESSURE_MEDICATION_FALSE, label: "NO" },
  ];

  const handleChange = (value: string) => {
    onChange(value as BloodPressureMedStatus);
  };

  return (
    <FieldWrapper>
      <RadioButtonGroup
        label={"Are you on blood pressure medication?"}
        value={value}
        onChange={handleChange}
        options={bloodPressureMedOptions}
      />
    </FieldWrapper>
  );
};

export default BloodPressureMedField;
