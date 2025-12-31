import React from "react";
import { RadioButtonGroup } from "@nuralogix.ai/web-ui";
import FieldWrapper from "../FieldWrapper";
import { Unit } from "../types";
import { FORM_VALUES } from "../constants";

interface UnitSelectorProps {
  value: Unit;
  onChange: (value: Unit) => void;
}

const UnitSelector: React.FC<UnitSelectorProps> = ({ value, onChange }) => {
  const unitOptions = [
    { value: FORM_VALUES.METRIC, label: "Metric" },
    { value: FORM_VALUES.IMPERIAL, label: "Imperial" },
  ];

  const handleChange = (value: string) => {
    onChange(value as Unit);
  };

  return (
    <FieldWrapper>
      <RadioButtonGroup
        label={"Preferred unit"}
        value={value}
        onChange={handleChange}
        options={unitOptions}
      />
    </FieldWrapper>
  );
};

export default UnitSelector;
