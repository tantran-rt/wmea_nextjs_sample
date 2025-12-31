"use client";
import useResponsive from "@/hooks/useResponsive";
import React from "react";
import WebFormWizard from "./WebFormWizard";
import MobileFormWizard from "./MobileFormWizard";

export default function Profile() {
  const { isDesktop, isLoading } = useResponsive();
  if (isLoading) {
    return <div>Intinializing...</div>;
  }
  return isDesktop ? <WebFormWizard /> : <MobileFormWizard />;
}
