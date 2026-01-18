import { DeepgramError, createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";

export async function POST() {
  // exit early so we don't request 70000000 keys while in devmode
  if (process.env.API_KEY_STRATEGY === "provided") {
    return NextResponse.json(
      process.env.DEEPGRAM_API_KEY
        ? { key: process.env.DEEPGRAM_API_KEY }
        : new DeepgramError(
            "Can't do local development without setting a `DEEPGRAM_API_KEY` environment variable.",
          ),
    );
  }

  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    console.error("DEEPGRAM_API_KEY is not set");
    return NextResponse.json(
      { error: "DEEPGRAM_API_KEY environment variable is not set" },
      { status: 500 }
    );
  }

  try {
    const deepgram = createClient(apiKey);
    let { result: token, error: tokenError } = await deepgram.auth.grantToken();

    if (tokenError) {
      console.error("Deepgram token error:", tokenError);
      return NextResponse.json(tokenError, { status: 500 });
    }

    if (!token || !token.access_token) {
      console.error("No access token in response:", token);
      return NextResponse.json(
        { error: "No access token received from Deepgram" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ...token });
  } catch (error) {
    console.error("Error in authenticate route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to authenticate with Deepgram" },
      { status: 500 }
    );
  }
}
