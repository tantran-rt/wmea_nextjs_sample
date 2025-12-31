"use client";
import { useState } from "react";
import { Heading, Card, Paragraph, Button } from "@nuralogix.ai/web-ui";

import ProfileInfo from "./ProfileInfo";
import MedicalQuestionnaire from "./MedicalQuestionnaire";
import { FormState, WizardStep } from "./types";
import { INITIAL_FORM_STATE, WIZARD_STEPS } from "./constants";
import useUnitConversion from "./hooks/useUnitConversion";
import { usePrepopulateForm } from "./hooks/usePrepopulateForm";
import { useRouter } from "next/navigation";
import {
  setDemographics,
  demographicsState,
} from "@/redux/slices/demographics/state";
import { useDispatch, useSelector } from "react-redux";
import { useFormSubmission } from "./utils/formSubmissionUtils";

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 20px",
    boxSizing: "border-box",
    height: "calc(100dvh - 64px)",
    overflowY: "auto",
    width: "100%",
  },
  card: {
    padding: "32px",
    maxWidth: "450px",
    width: "100%",
    "@media (minWidth: 640px)": {
      maxWidth: "560px",
      padding: "40px",
    },
    "@media (minWidth: 900px)": {
      maxWidth: "640px",
    },
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "16px",
  },
  introMessage: {
    marginBottom: "24px",
  },
} as const;

const FormWizard = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(
    WIZARD_STEPS.PROFILE
  );
  const { demographics } = useSelector(demographicsState);
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  const router = useRouter();
  const { handleSubmit } = useFormSubmission();
  const dispatch = useDispatch();

  useUnitConversion(formState, setFormState);
  usePrepopulateForm(setFormState);

  const handleNextStep = () => {
    setCurrentStep(WIZARD_STEPS.MEDICAL);
  };

  const handlePreviousStep = () => {
    setCurrentStep(WIZARD_STEPS.PROFILE);
  };

  const onSubmit = () => handleSubmit(formState);

  return (
    <div style={styles.wrapper}>
      <Card style={styles.card}>
        <div style={styles.headerRow}>
          <Heading>
            {currentStep === WIZARD_STEPS.PROFILE
              ? "Basic Information"
              : "Health Questions"}
          </Heading>
          <Button
            variant="link"
            type="button"
            onClick={() => {
              dispatch(
                setDemographics({
                  ...demographics,
                  bypassProfile: true,
                })
              );
              router.push("/measurement");
            }}
          >
            {"Skip profile"}
          </Button>
        </div>
        <div style={styles.introMessage}>
          <Paragraph>
            {
              "Please provide your information below to ensure an accurate health measurement."
            }
          </Paragraph>
        </div>

        {currentStep === WIZARD_STEPS.PROFILE && (
          <ProfileInfo
            formState={formState}
            setFormState={setFormState}
            onNext={handleNextStep}
          />
        )}

        {currentStep === WIZARD_STEPS.MEDICAL && (
          <MedicalQuestionnaire
            formState={formState}
            setFormState={setFormState}
            onSubmit={onSubmit}
            onBack={handlePreviousStep}
          />
        )}
      </Card>
    </div>
  );
};

export default FormWizard;
