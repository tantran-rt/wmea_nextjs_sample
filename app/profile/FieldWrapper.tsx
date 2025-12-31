import React, { CSSProperties } from "react";

const styles: { fieldWrapper: CSSProperties; textInput: CSSProperties } = {
  fieldWrapper: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "12px",
  },
  // For text inputs - reserves space for validation messages
  textInput: {
    minHeight: "90px", // Label + input + validation message space
  },
};

interface FieldWrapperProps {
  children: React.ReactNode;
  variant?: "textInput";
}

const FieldWrapper: React.FC<FieldWrapperProps> = ({ children, variant }) => {
  return (
    <div
      style={
        {...styles.fieldWrapper,
        ...(variant === "textInput" && styles.textInput as CSSProperties)
      }}
    >
      {children}
    </div>
  );
};

export default FieldWrapper;
