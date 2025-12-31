"use client";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import "./carousel.css";
import { welcomeData } from "@/utils/appData";
import CarouselCard from "@/components/carousel-card";
import useResponsive from "@/hooks/useResponsive";

function Carousel() {
  const { isDesktop } = useResponsive();

  // Always show only the first slide
  const firstSlide = welcomeData[0];

  return (
    <div
      className="carousel"
      style={{ overflowY: "auto", overflowX: "hidden" }}
    >
      <div style={{ height: "fit-content", minHeight: "10px" }}>
        <CarouselCard
          image={
            !isDesktop && firstSlide.title === "SomeSpecificSlide"
              ? "/icons/phone-icon.svg"
              : firstSlide.imgUri
          }
          title={firstSlide.title}
          texts={firstSlide.texts}
        />
      </div>
    </div>
  );
}

export default Carousel;
