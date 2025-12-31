import { NextResponse } from "next/server";
import client, { enums } from "@nuralogix.ai/dfx-api-client";

const { DeviceTypeID } = enums;

export async function GET() {
  const API_URL = process.env.API_URL;
  const LICENSE_KEY = process.env.LICENSE_KEY;

  if (!API_URL || !LICENSE_KEY) {
    return NextResponse.json(
      { status: "500", error: "API credentials not configured" },
      { status: 500 }
    );
  }

  const apiClient = client({
    url: {
      http: new URL(`https://${API_URL}`),
      wss: new URL(`wss://${API_URL}`),
    },
  });

  const payload = {
    Key: LICENSE_KEY,
    DeviceTypeID: DeviceTypeID.WIN32,
    Name: "Anura Web Core SDK",
    Identifier: "ANURA_WEB_CORE_SDK",
    Version: "0.1.0-beta.2",
    TokenExpiresIn: 3600, // 1 hour
  };

  try {
    const response = await apiClient.http.organizations.registerLicense(
      payload,
      false
    );
    const { status, body } = response;

    if (status === "200") {
      return NextResponse.json({
        status,
        token: body.Token,
        refreshToken: body.RefreshToken,
      });
    } else {
      return NextResponse.json(
        { status, error: body },
        { status: parseInt(status) }
      );
    }
  } catch (error) {
    console.error("Token registration error:", error);
    return NextResponse.json(
      {
        status: "500",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
