import { useState } from "react";
import { addCode } from "../services/database";
import { QRCodeSVG } from "qrcode.react";

export default function Codes() {
  const [codes, setCodes] = useState([]);

  const gridSize = 16;

  async function handleSubmit(isBounty) {
    try {
      const promises = Array.from({ length: gridSize }, () =>
        addCode(isBounty)
      );
      const results = await Promise.all(promises);
      const newCodes = results.map(({ code }) => ({
        code,
        url: `${window.location.origin}/${code}`,
      }));
      setCodes((prev) => [...prev, ...newCodes]);
    } catch (err) {
      console.error("Failed to add code:", err);
    }
  }

  return (
    <>
      <button className="bigButton" onClick={() => handleSubmit(false)}>
        No Bounty
      </button>
      <button className="bigBountyButton">Bounty</button>{" "}
      {/* add this for bounty onClick={() => handleSubmit(true)}}*/}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, max-content)",
          justifyContent: "center",
          gap: "0",
          marginTop: "2rem",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        {codes.map(({ code, url }) => (
          <div
            key={code}
            style={{
              border: "1px dashed #999",
            }}
          >
            <div
              style={{
                width: "190px",
                height: "250px",
                boxSizing: "border-box",
                background: "#10b981",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 14px 10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <img src="/trackrLogo.png" width="18" alt="" />
                  <span
                    style={{
                      fontSize: "19px",
                      fontWeight: "bold",
                      color: "#000",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Trackr
                  </span>
                </div>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "10px",
                    padding: "8px",
                    display: "flex",
                  }}
                >
                  <QRCodeSVG value={url} size={104} level="M" />
                </div>
              </div>
              <div
                style={{
                  alignSelf: "stretch",
                  flex: 1,
                  background: "#000",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1px",
                }}
              >
                <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#fff" }}>
                  Found this item?
                </div>
                <div style={{ fontSize: "10.5px", fontWeight: 500, color: "#10b981" }}>
                  Scan to notify owner
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
