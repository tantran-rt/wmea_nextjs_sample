import React from "react";
import { Button } from "@nuralogix.ai/web-ui";
import {
  SmokingField,
  BloodPressureMedField,
  DiabetesStatusField,
} from "./Fields";
import { FormState } from "./types";
import { isFormValid } from "./utils/validationUtils";
import { createFieldHandler } from "./utils/formUtils";
import { FORM_FIELDS } from "./constants";
import WizardStepWrapper from "./WizardStepWrapper";

const styles = {
  buttonWrapper: {
    marginTop: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    alignItems: "center",
  },
} as const;

interface MedicalQuestionnaireProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  onSubmit: () => void;
  onBack: () => void;
}

const MedicalQuestionnaire: React.FC<MedicalQuestionnaireProps> = ({
  formState,
  setFormState,
  onSubmit,
  onBack,
}) => {
  const { smoking, bloodPressureMed, diabetesStatus } = formState;

  return (
    <WizardStepWrapper onSubmit={onSubmit} isEnabled={isFormValid(formState)}>
      <SmokingField
        value={smoking}
        onChange={createFieldHandler(FORM_FIELDS.SMOKING, setFormState)}
      />
      <BloodPressureMedField
        value={bloodPressureMed}
        onChange={createFieldHandler(
          FORM_FIELDS.BLOOD_PRESSURE_MED,
          setFormState
        )}
      />
      <DiabetesStatusField
        value={diabetesStatus}
        onChange={createFieldHandler(FORM_FIELDS.DIABETES_STATUS, setFormState)}
      />
      <div style={styles.buttonWrapper}>
        <Button
          width="100%"
          onClick={onSubmit}
          disabled={!isFormValid(formState)}
        >
          Go to measurement
        </Button>
        <Button variant="link" onClick={onBack}>
          Back
        </Button>
      </div>
    </WizardStepWrapper>
  );
};

export default MedicalQuestionnaire;
