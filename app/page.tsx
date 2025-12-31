"use client";
import Image from "next/image";
import { Container, ThemeProvider } from "@nuralogix.ai/web-ui";
import lightTheme from "@nuralogix.ai/web-ui/themes/light";
import Profile from "./profile/page";

export default function Home() {
  const styles = {
    wrapper: {
      height: "100%",
      margin: 0,
      display: "flex",
      flexDirection: "column",
      overflowX: "hidden",
    },
  } as const;

  return (
    <ThemeProvider theme={lightTheme}>
      <Container>
        <div className="main" style={styles.wrapper}>
          <Profile />
        </div>
      </Container>
    </ThemeProvider>
  );
}
