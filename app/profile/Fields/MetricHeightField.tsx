"use client";
import React, { useState } from "react";
import { TextInput } from "@nuralogix.ai/web-ui";
import FieldWrapper from "../FieldWrapper";
import { isHeightMetricInvalid } from "../utils/validationUtils";
import { createFieldBlurHandler } from "../utils/formUtils";

interface MetricHeightFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const MetricHeightField: React.FC<MetricHeightFieldProps> = ({
  value,
  onChange,
}) => {
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = createFieldBlurHandler(value, onChange, setTouched);

  return (
    <FieldWrapper variant="textInput">
      <TextInput
        label={"Height (cm)"}
        value={value}
        onChange={handleChange}
        placeholder={"E.g. 175"}
        type="text"
        invalid={touched && isHeightMetricInvalid(value)}
        invalidMessage={"Height must be between 120 and 220 cm"}
        onBlur={handleBlur}
      />
    </FieldWrapper>
  );
};

export default MetricHeightField;
