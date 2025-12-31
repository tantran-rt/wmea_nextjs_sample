"use client";
import React, { useCallback } from "react";
import useGetDeviceInfo from "@/hooks/useGetDeviceInfo";
import useResponsive from "@/hooks/useResponsive";
import Image from "next/image";
import { Browser, MobilePlatform } from "@/types/constants";
import "./permission-modal.css";
import { sendLogs } from "@/utils/sendAnalytics.utils";

interface CameraPermissionModalOptions {
  showAudioInstructions?: boolean;
}

export const CameraPermissionModal = ({
  showAudioInstructions = false,
}: CameraPermissionModalOptions = {}) => {
  const { browserName } = useGetDeviceInfo();
  const { isDesktop } = useResponsive();

  const message =
    "\nCamera access has been blocked in this browser.\n To proceed:\n\n";

  sendLogs(`Camera permission on browser ${browserName}`);

  return (
    <div
      className="modal-container"
      style={{
        backgroundColor: "black",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        height: "100dvh",
        width: "100dvw",
        paddingLeft: "2rem",
        paddingRight: "2rem ",
        zIndex: 999,
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <p className="regular-text">
        <span className="bold-text">Camera Permission Error</span>
        {message}
      </p>

      {isDesktop ? (
        // Different instructions on tablet Chrome brower
        browserName === Browser.MobileChrome ? (
          <p className="regular-text">
            1. Open your phone <span className="bold-text">Settings</span>.
            <br></br>
            {"\n"}
            2. Navigate to:{" "}
            <span className="bold-text">
              Apps → Chrome → Permissions → Camera → Allow
            </span>
            .
            {showAudioInstructions && (
              <p className="regular-text">
                &nbsp; &nbsp; Navigate to:{" "}
                <span className="bold-text">
                  Apps → Chrome → Permissions → Microphone → Allow
                </span>
                .
              </p>
            )}
            <br></br>
            {"\n"}
            3. Refresh/Reload the page and log in again for the changes to take
            effect.
          </p>
        ) : (
          <p className="regular-text">
            1. Click the settings icon next to (or behind) the URL.
            <br></br>
            {"\n"}
            2. Under <span className="bold-text">Permissions</span>, set
            <span className="bold-text"> Camera</span> to
            <span className="bold-text"> Allow</span>.
            {showAudioInstructions && (
              <p className="regular-text">
                &nbsp; &nbsp; Under{" "}
                <span className="bold-text">Permissions</span>, set
                <span className="bold-text"> Microphone</span> to
                <span className="bold-text"> Allow</span>.
              </p>
            )}
            <br></br> {"\n"}
            3. Refresh/Reload the page and log in again for the changes to take
            effect.
          </p>
        )
      ) : browserName === Browser.Safari ||
        browserName === Browser.MobileSafari ? (
        <p className="regular-text">
          1. Click the settings icon next to (or behind) the URL.
          <br></br>
          {"\n"}
          2. Under <span className="bold-text">Permissions</span>, set
          <span className="bold-text"> Camera</span> to
          <span className="bold-text"> Allow</span>.
          {showAudioInstructions && (
            <p className="regular-text">
              &nbsp; &nbsp; Under <span className="bold-text">Permissions</span>
              , set
              <span className="bold-text"> Microphone</span> to
              <span className="bold-text"> Allow</span>.
            </p>
          )}
          <br></br>
          {"\n"}
          3. Refresh/Reload the page and log in again for the changes to take
          effect.
        </p>
      ) : (
        <p className="regular-text">
          1. Open your phone <span className="bold-text">Settings</span>.
          <br></br>
          {"\n"}
          2. Navigate to:{" "}
          <span className="bold-text">
            Apps → Chrome → Permissions → Camera → Allow
          </span>
          .
          {showAudioInstructions && (
            <p className="regular-text">
              &nbsp; &nbsp; Navigate to:{" "}
              <span className="bold-text">
                Apps → Chrome → Permissions → Microphone → Allow
              </span>
              .
            </p>
          )}
          <br></br>
          {"\n"}
          3. Refresh/Reload the page and log in again for the changes to take
          effect.
        </p>
      )}
    </div>
  );
};
