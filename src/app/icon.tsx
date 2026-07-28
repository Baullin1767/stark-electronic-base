import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          background: "#143c35",
          color: "#d9f873",
          fontSize: 25,
          fontWeight: 800,
          letterSpacing: -2,
        }}
      >
        SE
      </div>
    ),
    size,
  );
}
