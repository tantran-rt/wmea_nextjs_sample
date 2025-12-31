import React from "react";
import { Heading } from "@nuralogix.ai/web-ui";
import MobileMenu from "../MobileMenu";
import useResponsive from "@/hooks/useResponsive";

const styles = {
  wrapper: {
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    boxSizing: "border-box",
    borderBottom: "1px solid #e0e0e0",
  },
  desktopActions: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  mobileMenuWrapper: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: 18,
  },
} as const;

const MeasurementHeader: React.FC = () => {
  const { isDesktop } = useResponsive();

  return (
    <div style={styles.wrapper}>
      <div style={styles.title}>
        <Heading>Web Measurement Embedded Sample App</Heading>
      </div>
      {isDesktop ? (
        <div style={styles.desktopActions}></div>
      ) : (
        <div style={styles.mobileMenuWrapper}>
          <MobileMenu />
        </div>
      )}
    </div>
  );
};

export default MeasurementHeader;
