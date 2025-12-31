import { DemographicsState } from "./types";
import { faceAttributeValue } from "@nuralogix.ai/web-measurement-embedded-app";
import { loadSavedDemographics, saveDemographics } from "@/utils/localStorage";
import { createSlice } from "@reduxjs/toolkit";

const {
  SEX_ASSIGNED_MALE_AT_BIRTH,
  SMOKER_FALSE,
  BLOOD_PRESSURE_MEDICATION_FALSE,
  DIABETES_NONE,
} = faceAttributeValue;

const initial = loadSavedDemographics() || {
  age: 0,
  height: 0,
  weight: 0,
  sex: SEX_ASSIGNED_MALE_AT_BIRTH,
  smoking: SMOKER_FALSE,
  bloodPressureMedication: BLOOD_PRESSURE_MEDICATION_FALSE,
  diabetes: DIABETES_NONE,
  bypassProfile: true,
};

const demographicsSlice = createSlice({
  name: "demographics",
  initialState: {
    demographics: initial,
  } as DemographicsState,
  reducers: {
    setDemographics(state, action) {
      state.demographics = action.payload;
      saveDemographics(action.payload);
    },
  },
});

export const { setDemographics } = demographicsSlice.actions;
export const demographicsState = (state: { demographics: DemographicsState }) =>
  state.demographics;

export default demographicsSlice.reducer;

// const demographicsState: DemographicsState = proxy({
//   demographics: initial,
//   setDemographics: (demographics) => {
//     demographicsState.demographics = demographics;
//     saveDemographics(demographics);
//   },
// });

// export default demographicsState;
