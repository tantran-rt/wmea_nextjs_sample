"use client";
import React, { useState, useEffect } from "react";
import { TextInput } from "@nuralogix.ai/web-ui";
import FieldWrapper from "../FieldWrapper";
import {
  isWeightMetricInvalid,
  isWeightImperialInvalid,
} from "../utils/validationUtils";
import { createFieldBlurHandler } from "../utils/formUtils";

interface WeightFieldProps {
  value: string;
  onChange: (value: string) => void;
  isMetric: boolean;
}

const WeightField: React.FC<WeightFieldProps> = ({
  value,
  onChange,
  isMetric,
}) => {
  const [touched, setTouched] = useState(false);

  // Reset touched state when unit changes
  useEffect(() => {
    setTouched(false);
  }, [isMetric]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = createFieldBlurHandler(value, onChange, setTouched);

  return (
    <FieldWrapper variant="textInput">
      <TextInput
        label={isMetric ? "Weight (kg)" : "Weight (lbs)"}
        value={value}
        onChange={handleChange}
        placeholder={isMetric ? "E.g. 70" : "E.g. 154"}
        invalid={
          touched &&
          (isMetric
            ? isWeightMetricInvalid(value)
            : isWeightImperialInvalid(value))
        }
        invalidMessage={
          isMetric
            ? "Weight must be between 30 and 300 kg"
            : "Weight must be between 66 and 661 lbs"
        }
        onBlur={handleBlur}
      />
    </FieldWrapper>
  );
};

export default WeightField;
