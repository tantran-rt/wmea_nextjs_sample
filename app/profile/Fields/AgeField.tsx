"use client";

import React, { useState } from "react";
import { TextInput } from "@nuralogix.ai/web-ui";
import FieldWrapper from "../FieldWrapper";
import { isAgeInvalid } from "../utils/validationUtils";
import { createFieldBlurHandler } from "../utils/formUtils";

interface AgeFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const AgeField: React.FC<AgeFieldProps> = ({ value, onChange }) => {
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = createFieldBlurHandler(value, onChange, setTouched);

  return (
    <FieldWrapper variant="textInput">
      <TextInput
        label={"Age"}
        value={value}
        onChange={handleChange}
        placeholder={"E.g. 25"}
        invalid={touched && isAgeInvalid(value)}
        invalidMessage={"Age must be between 13 and 120 years"}
        onBlur={handleBlur}
      />
    </FieldWrapper>
  );
};

export default AgeField;
