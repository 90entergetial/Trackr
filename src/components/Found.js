import { useState, useEffect } from "react";
import { setLongLat, appendimageData } from "../services/database";
import { QRCodeCanvas } from "qrcode.react";
import { sendMessage } from "../services/notify";
import Camera, { FACING_MODES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

export default function Found(props) {
  //Send Location to Name
  let [success, setSuccess] = useState("not yet");
  //const [locationState, setLocationState] = useState(null);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [dataUri, setDataUri] = useState(false);
  const [rror, setRror] = useState(0);

  useEffect(() => {
    async function notifyOwner() {
      await sendMessage(props.info);
    }
    notifyOwner();
    setStatusFound(props.info.code);
  }, [props.info]);

  async function Locate(event) {
    event.preventDefault();

    if (success === "not yet" && !isRequestingLocation) {
      setIsRequestingLocation(true);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log(latitude + ", " + longitude + ", " + props.info.code);

            if (await setLongLat(latitude, longitude, props.info.code)) {
              setSuccess("success");
            }
            setIsRequestingLocation(false);
          },
          (error) => {
            console.error("Error getting location:", error);
            alert(
              "Unable to get your location. Please enable location permissions."
            );
            setIsRequestingLocation(false);
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
        setIsRequestingLocation(false);
      }
    }
  }

  //Get Image to Name
  async function handleTakePhoto(dataUri) {
    // Do stuff with the photo...
    if (rror == 0) {
      await appendimageData(dataUri, props.info.code);
      setDataUri(dataUri);
      console.log("takePhoto");
    }
  }
  function handleCameraError(error) {
    if (rror == 0) {
      alert(
        "Camera permissions are off. Please enable camera permissions and reload."
      );
    }
    setRror(1);
    console.log("handleCameraError", error);
  }
  function resetdataUri() {
    setDataUri(false);
  }

  return (
    <div className="found-page">
      {/* Navigation */}
      <nav className="found-nav">
        <div className="found-nav-container">
          <div className="found-logo">
            <img src="/trackrLogo.png" width="25" alt="Trackr Logo" />
            <span className="found-nav-brand">Trackr</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="found-container">
        <div className="found-content">
          {/* Header */}
          <div className="found-header">
            <h1 className="found-title">
              You found {props.info.name}'s {props.info.objname}!
            </h1>
            <p className="found-subtitle">
              Help reunite this item with its owner
            </p>
          </div>

          {/* Message Section */}
          <div className="found-message-section">
            <div className="found-message-label">Message from the owner</div>
            <div className="found-message">
              <svg
                className="found-message-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="found-message-text">{props.info.message}</p>
            </div>
          </div>

          {/* Action Section */}
          <div className="found-actions">
            {success == "not yet" ? (
              <div className="found-form">
                <button onClick={Locate} className="found-btn-primary">
                  <svg
                    className="found-btn-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Send Location to {props.info.name}
                </button>
              </div>
            ) : (
              <div className="found-success">
                <div className="found-success-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="found-success-title">
                  Location Sent Successfully!
                </h2>
                <p className="found-success-message">
                  Your location has been shared with {props.info.name}. Thank
                  you for helping reunite this item with its owner!
                </p>

                {rror == 1 ? (
                  <>
                    <p>
                      Camera permissions are off. Please enable camera
                      permissions and reload.
                    </p>
                  </>
                ) : (
                  <></>
                )}
                {dataUri ? (
                  <>
                    <h3>
                      Here is the image! It has been sent to {props.info.name}!
                    </h3>
                    <img className="found-image" src={dataUri} />
                    <button className="found-retake" onClick={resetdataUri}>
                      Retake photo
                    </button>
                  </>
                ) : (
                  <>
                    <h3>
                      Take a picture of {props.info.objname} and it's
                      surroundings!
                    </h3>

                    <Camera
                      className="found-camera"
                      onTakePhoto={(dataUri) => {
                        handleTakePhoto(dataUri);
                      }}
                      idealResolution={{ width: 640, height: 480 }}
                      onCameraError={(rror) => {
                        handleCameraError(rror);
                      }}
                      idealFacingMode={FACING_MODES.ENVIRONMENT}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
