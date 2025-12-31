"use client";
import React, { useState } from "react";
import { TextInput } from "@nuralogix.ai/web-ui";
import FieldWrapper from "../FieldWrapper";
import {
  isHeightFeetInvalid,
  isHeightInchesInvalid,
} from "../utils/validationUtils";
import { createFieldBlurHandler } from "../utils/formUtils";

const styles = {
  container: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },
  inputWrapper: {
    flex: 1,
  },
} as const;

interface ImperialHeightFieldProps {
  feet: string;
  inches: string;
  onFeetChange: (value: string) => void;
  onInchesChange: (value: string) => void;
}

const ImperialHeightField: React.FC<ImperialHeightFieldProps> = ({
  feet,
  inches,
  onFeetChange,
  onInchesChange,
}) => {
  const [feetTouched, setFeetTouched] = useState(false);
  const [inchesTouched, setInchesTouched] = useState(false);

  const handleFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFeetChange(e.target.value);
  };

  const handleInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInchesChange(e.target.value);
  };

  const handleFeetBlur = createFieldBlurHandler(
    feet,
    onFeetChange,
    setFeetTouched
  );
  const handleInchesBlur = createFieldBlurHandler(
    inches,
    onInchesChange,
    setInchesTouched
  );

  return (
    <FieldWrapper variant="textInput">
      <div style={styles.container}>
        <div style={styles.inputWrapper}>
          <TextInput
            label={"Feet"}
            value={feet}
            onChange={handleFeetChange}
            placeholder={"E.g. 5"}
            type="text"
            invalid={feetTouched && isHeightFeetInvalid(feet)}
            invalidMessage={"Enter feet (3-7)"}
            onBlur={handleFeetBlur}
          />
        </div>
        <div style={styles.inputWrapper}>
          <TextInput
            label={"Inches"}
            value={inches}
            onChange={handleInchesChange}
            placeholder={"E.g. 11"}
            type="text"
            invalid={inchesTouched && isHeightInchesInvalid(inches)}
            invalidMessage={"Enter inches (0-11)"}
            onBlur={handleInchesBlur}
          />
        </div>
      </div>
    </FieldWrapper>
  );
};

export default ImperialHeightField;
