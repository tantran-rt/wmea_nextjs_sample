import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MeasurementState } from "./types";
import type { Results } from "@nuralogix.ai/web-measurement-embedded-app";

const initial: Omit<MeasurementState, "setResults"> = {
  apiUrl: "api.na-east.deepaffex.ai",
  results: null,
};

const measurementSlice = createSlice({
  name: "measurement",
  initialState: initial,
  reducers: {
    setResults: (state, action: PayloadAction<Results | null>) => {
      state.results = action.payload;
    },
  },
});

export const { setResults } = measurementSlice.actions;
export const measurementState = (state: { measurement: MeasurementState }) =>
  state.measurement;

export default measurementSlice.reducer;

// const measurementState: MeasurementState = proxy({
//   apiUrl: "api.na-east.deepaffex.ai",
//   results: null,
//   setResults: (results: Results | null) => {
//     measurementState.results = results;
//   },
// });

// export default measurementState;
