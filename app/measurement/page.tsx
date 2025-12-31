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
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJPcmdhbml6YXRpb25JRCI6ImNhZThmNzhlLTU5MDgtNDgyZS05MWQwLTNjOTkyMTlmOWFiNyIsIklEIjoiYjVkM2IwNzUtMzZhOS00MjBkLTg3NGQtZmNmMTVmNzkyM2IwIiwiVHlwZSI6IkRldmljZSIsIkRldmljZUlEIjoiYjVkM2IwNzUtMzZhOS00MjBkLTg3NGQtZmNmMTVmNzkyM2IwIiwiU2Vzc2lvbkdlbiI6MCwiUmVnaW9uIjoibmEtZWFzdCIsImV4cCI6MTc2NzEyMDI4NTY2NiwiaWF0IjoxNzY3MTE2Njg1NjY2LCJpc3MiOiJ1cm46ZGVlcGFmZmV4In0.C0Eq-lqOs48YVNBAoiq9rjxLx3qrqu7C--EBv2N1_5o",
            refreshToken:
              "U2FsdGVkX19xpKnw4ANeI+NhrLnq9XnpRFPgw23MByug8MJ3DlDiPc44/byVxjiptwTRzIBlbhGrA7ANV02P2GVOXUMsxGLhFzrBsk/NpXsjY03fOuBx48XLSrhGcpeYAMC+mqs44EPlzMgpTxdWGHDsA9PYdvnjEi+/bf0R+hbO/ex2DO2cS3uvZTPrUtgG/8sI2Ew9xT0Edwn8O+92PEuWN/0vaIU61ACzFKR+zQQjOhAWj1AYjkxnQDYsNLPqC2pQNsZJBp679FsewfOhvQq+kw9EGOigq+oCJYjWfGtSthsBwFfczaZno046r5r8adPdMJrbIWEUniDkDFTvXYNKoyptQgZTA8SP0QGm+4qeZUDJQnh+aIDxTyxrjifGf6hHfibczCU599jNzofwOXrewZ0fdzM9yST++3uPRM5zzTr8Ak/4tl31tZKEyoBEQMKJzdF3ikQheUW7g69sYG5qzr2JMb51ykQ6zksATOuv4iliDUAUGf5QWkXEq3gaQuKrbXj7b+a2lrd+jYwoLi/tzqYovP5iMlyr/fpfsE9AVi3YG6HbrnifmI1lkazuthxFPSZu6cFNRLhQDuik27SwGEUzwJXvmiw1chQrf2EEonNGmenNOXRK8G89QRZuQv3lFhDOM01bwk+T+xRezxyuUkMZnDWmLfuL5JbL5xNiKOeVejpqFopJMPZRPWe/X7FyMRu1swZQ43FeRxDKTmAt37x+cEXXMEt0JVakaps5eOkXOrncM2owNC0MvG+blhWzNy5vo85LUzGctnbgID9kwPgCm0tcTaHQUvxmzLKVP2Q3Tz38/F37b/xMm/hEdCN7lJU+ghzEIC3yrYa5I3OsAPj9un+t85XyZ3SjI+SBO1ZWFHkZm0pu/AG2TnAMEFHNWVHYhytfqThUlGe9HRP6tdMxvwFUA12UMEIqVoXOsvq1twTOIP66jq4f9RVUYRuJtOmpMFjntm4WFI8b7vnUnk38M/O/+i0n5QkdPlFwUnYp6Z049odXcsK4m96KeX3cQoOdX4yHm7cTkyJk0q+BrOyG387v/YXtKNHhYs5wbpA91P8Q73kT2lBptjEFTLxCeErKQPRS5oWdyFKhWJKzAMbm0BFrOHJKDtI6gDxlxGDgMGRJ2sJh1/yVrsJoDZGRgAZOg2gOLU+8//0qiw==",
            studyId: "5f77f398-055c-4f46-9e4d-d3fb81381dd5",
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
