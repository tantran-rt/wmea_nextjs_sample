import { configureStore } from "@reduxjs/toolkit";

import {
  drugTest,
  preTest,
  scoreMatrix,
  bacTest,
  demographics,
} from "./slices";

export const store = configureStore({
  reducer: { drugTest, preTest, scoreMatrix, bacTest, demographics },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["drugTest/saveClip"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.size", "payload.type"],
        // Ignore these paths in the state
        ignoredPaths: ["drugTest.testClip"],
      },
    }),
});

// RootState and AppDispatch types
export type AppDispatch = typeof store.dispatch;
