import { FormState } from "../types";
import { isFormValid } from "./validationUtils";
import { convertFormStateToSDKDemographics } from "./utils";
import { useRouter } from "next/navigation";
import {
  demographicsState,
  setDemographics,
} from "@/redux/slices/demographics/state";
import { useDispatch, useSelector } from "react-redux";

export const useFormSubmission = () => {
  const router = useRouter();
  const { demographics } = useSelector(demographicsState);
  const dispatch = useDispatch();

  const handleSubmit = (formState: FormState) => {
    // Defensive validation check but disabled btns should prevent this
    if (!isFormValid(formState)) {
      // TODO: Show error notification to user if needed
      return;
    }

    // Convert form data to SDK format before pushing to store
    const demographicsData = convertFormStateToSDKDemographics(formState);

    // Update the demographics store
    dispatch(setDemographics(demographicsData));

    // Navigate to measurement page
    router.push("/measurement");
  };

  return {
    handleSubmit,
  };
};
