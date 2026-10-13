import { setupCode } from "../services/database";
import { useState } from "react";

export default function Setup(props) {
  let [sucess, setsucess] = useState("not yet");
  const [isBounty, setIsBounty] = useState(props.isBounty || false);

  async function Submits(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const TheNam = formData.get("TheName");
    const TheDes = formData.get("TheDesc");
    const TheirN = formData.get("TheirName");
    const TheirG = formData.get("TheirGmail").trim().toLowerCase();

    let Bounty = null;

    if (isBounty) {
      const bountyInput = formData.get("TheirBounty");
      if (!bountyInput) {
        setsucess("bounty_fail");
        return;
      }
      const bountyAmount = parseFloat(bountyInput);
      if (isNaN(bountyAmount) || bountyAmount < 0.05) {
        setsucess("bounty_fail");
        return;
      }
      Bounty = bountyAmount;
    }

    console.log(
      "YourName: " +
        TheirN +
        "\nYourGmail: " +
        TheirG +
        "\nObjName: " +
        TheNam +
        " \nDesc: " +
        TheDes +
        (isBounty ? "\nBounty: " + Bounty : "")
    );

    if (TheNam !== "" && TheDes !== "" && TheirN !== "" && TheirG !== "") {
      try {
        if (
          await setupCode(TheNam, TheDes, TheirN, TheirG, props.theid, Bounty)
        ) {
          setsucess("sucess");
        } else {
          setsucess("fail");
        }
      } catch (error) {
        console.error("Setup failed:", error);
        setsucess("fail");
      }
    } else {
      setsucess("fail");
    }
  }

  return (
    <div className="setup-page">
      {/* Navigation */}
      <nav className="setup-nav">
        <div className="setup-nav-container">
          <a href="/" style={{ textDecoration: "none" }}>
            <div className="setup-logo">
              <img src="/trackrLogo.png" width="25" alt="Trackr Logo" />
              <span className="setup-nav-brand">Trackr</span>
            </div>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="setup-container">
        <div className="setup-content">
          {sucess != "sucess" && (
            <>
              <h1 className="setup-title">Setup Your Trackr</h1>
              <p className="setup-subtitle"></p>

              <form onSubmit={Submits} className="setup-form">
                <div className="setup-form-grid">
                  <input
                    name="TheirName"
                    type="text"
                    placeholder="Your name"
                    className="setup-input"
                  />
                  <input
                    name="TheName"
                    type="text"
                    placeholder="Object's name"
                    className="setup-input"
                  />
                  <input
                    name="TheDesc"
                    type="text"
                    placeholder="Message for finder"
                    className="setup-input setup-input-full"
                  />
                  {isBounty && (
                    <input
                      name="TheirBounty"
                      type="number"
                      step="0.01"
                      min="3.00"
                      placeholder="Bounty min $3.00"
                      className="setup-input"
                    />
                  )}
                  <input
                    name="TheirGmail"
                    type="email"
                    placeholder="Email address"
                    className="setup-input"
                  />
                </div>
                <button type="submit" className="setup-btn-primary">
                  Set Up Trackr
                </button>
              </form>

              {sucess == "fail" && (
                <div className="setup-error">
                  <p>Please fill in all required fields!</p>
                </div>
              )}

              {sucess == "bounty_fail" && (
                <div className="setup-error">
                  <p>Bounty must be at least $0.05!</p>
                </div>
              )}
            </>
          )}

          {sucess == "sucess" && (
            <div className="setup-success">
              <div className="setup-success-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="setup-success-message">
                This Trackr has been set up successfully! You can close this
                tab.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
