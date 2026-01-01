"use client";
import { useEffect, useState } from "react";
import MeasurementEmbeddedApp, {
  appEvents,
  type MeasurementEmbeddedAppError,
  type MeasurementEmbeddedAppOptions,
} from "@nuralogix.ai/web-measurement-embedded-app";
import lightTheme from "@nuralogix.ai/web-ui/themes/light";

import ErrorMessage from "./ErrorMessage";
import MeasurementHeader from "./MeasurementHeader";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100dvh",
    width: "100%",
    overflow: "hidden",
  },
} as const;
import { isUiErrorCode, isCancelOnErrorCode } from "./constants";
import { useRouter } from "next/navigation";
import { setResults } from "@/redux/slices/measurement/state";
import { demographicsState } from "@/redux/slices/demographics/state";
import { useSelector, useDispatch } from "react-redux";
import { Container, ThemeProvider } from "@nuralogix.ai/web-ui";

export type SupportedLanguage = "en";

const Measurement = () => {
  // Only create MeasurementEmbeddedApp on client side
  const [measurementApp] = useState<MeasurementEmbeddedApp | null>(() => {
    if (typeof window !== "undefined") {
      return new MeasurementEmbeddedApp();
    }
    return null;
  });

  const [isInit, setIsInit] = useState(false);
  const dispatch = useDispatch();
  const { demographics } = useSelector(demographicsState);
  // const { theme, language } = useSnapshot(state.general);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const router = useRouter();
  const [appError, setAppError] = useState<MeasurementEmbeddedAppError | null>(
    null
  );

  useEffect(() => {
    // Only proceed if we're on the client and have an app instance
    if (!measurementApp || typeof window === "undefined") {
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    (async function () {
      const container = document.createElement("div");
      container.id = "measurement-embedded-app-container";
      document.body.appendChild(container);
      console.log("MeasurementEmbeddedApp started");
      const apiUrl = "/api/measurement";
      const studyId = await fetch(`${apiUrl}/studyId`);
      const studyIdResponse = await studyId.json();
      const token = await fetch(`${apiUrl}/token`);
      const tokenResponse = await token.json();

      if (studyIdResponse.status === "200" && tokenResponse.status === "200") {
        console.log("Received Study ID and Token");
        const options: MeasurementEmbeddedAppOptions = {
          container,
          language: "en",
          appPath: `${window.location.origin}/wmea`,
          // apiUrl: 'api.na-east.deepaffex.ai',
          settings: {
            token: tokenResponse.token,
            refreshToken: tokenResponse.refreshToken,
            studyId: studyIdResponse.studyId,
          },
          profile: demographics,
          config: {
            checkConstraints: true,
            cameraFacingMode: "user",
            cameraAutoStart: false,
            measurementAutoStart: false,
            cancelWhenLowSNR: true,
          },
        };
        // Setting event handlers - modifying object properties is safe here
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (measurementApp as any).on.results = (results: any) => {
          console.log(`Got results: ${JSON.stringify(results)}`);
          dispatch(setResults(results));
          router.push("/results");
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (measurementApp as any).on.error = async (
          error: MeasurementEmbeddedAppError
        ) => {
          if (isCancelOnErrorCode(error.code)) {
            try {
              await measurementApp.cancel(true);
            } catch (e) {
              console.warn("Failed to cancel after error code", error.code, e);
            }
          }
          if (isUiErrorCode(error.code)) {
            setAppError(error);
          }
          console.log("Error received: ", error.code, error.message);
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (measurementApp as any).on.event = (appEvent: any) => {
          console.log("App event received", appEvent);
          switch (appEvent) {
            case appEvents.APP_LOADED:
              break;
            case appEvents.ASSETS_DOWNLOADED:
              break;
            case appEvents.CAMERA_PERMISSION_GRANTED:
              break;
            case appEvents.CAMERA_STARTED:
              break;
            case appEvents.CONSTRAINT_VIOLATION:
              break;
            case appEvents.INTERMEDIATE_RESULTS:
              break;
            case appEvents.MEASUREMENT_CANCELED:
              break;
            case appEvents.MEASUREMENT_COMPLETED:
              break;
            case appEvents.MEASUREMENT_PREPARED:
              break;
            case appEvents.MEASUREMENT_STARTED:
              break;
            case appEvents.PAGE_UNLOADED:
              break;
            case appEvents.PAGE_VISIBILITY_CHANGE:
              break;
            case appEvents.RESULTS_RECEIVED:
              break;
            default:
              break;
          }
          console.log("App event received", appEvent);
        };
        try {
          console.log(
            "initizializing MeasurementEmbeddedApp with option ",
            JSON.stringify(options)
          );
          await measurementApp.init(options);
          setIsInit(true);
          // measurementApp.setTheme(theme);
        } catch (error) {
          console.error("Failed to initialize MeasurementEmbeddedApp:", error);
        }
      } else {
        console.error("Failed to get Study ID and Token pair");
      }
    })();
    return () => {
      const cleanup = async () => {
        if (measurementApp) {
          try {
            const logs = await measurementApp.getLogs();
            console.log("WMEA Logs:", logs);
            // Destroy the instance and free up resources
            await measurementApp.destroy();
          } catch (error) {
            console.warn("Error during cleanup:", error);
          }
        }
        setIsInit(false);
        const container = document.getElementById(
          "measurement-embedded-app-container"
        );
        if (container && container.parentNode) {
          container.parentNode.removeChild(container);
        }
      };
      cleanup();
    };
  }, [demographics, router, dispatch, measurementApp]);

  // Listen for theme changes and update the measurement app
  useEffect(() => {
    if (isInit && measurementApp) {
      measurementApp.setTheme("light");
    }
  }, [theme, isInit, measurementApp]);

  // Listen for language changes and update the measurement app
  useEffect(() => {
    if (isInit && language && measurementApp) {
      measurementApp.setLanguage("en");
    }
  }, [language, isInit, measurementApp]);

  const onClear = () => {
    setAppError(null);
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Container>
        <div style={styles.container}>
          <MeasurementHeader />
          {appError ? (
            <ErrorMessage error={appError} onClear={onClear} />
          ) : null}
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default Measurement;
