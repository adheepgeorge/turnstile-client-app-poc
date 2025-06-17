import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const SITE_KEY = "0x4AAAAAABg8fBKvm3kslBsU";
  const [tokenReady, setTokenReady] = useState(false);
  const turnstileRef = React.useRef(null);
  const widgetIdRef = React.useRef(null);
  /**
   * 
This useEffect is responsible for:
Rendering the Cloudflare Turnstile widget explicitly when the component mounts.
Cleaning up (removing) the widget when the component unmounts.
   */

  useEffect(() => {
    function renderTurnstile() {
      if (window.turnstile && turnstileRef.current) {
        widgetIdRef.current = window.turnstile.render("#turnstile-container", {
          sitekey: SITE_KEY,
          // eslint-disable-next-line no-unused-vars
          callback: function (token) {
            setTokenReady(true);
          },
          "expired-callback": function () {
            setTokenReady(false);
          },
        });
      }
    }

    // Wait for the script to load
    if (window.turnstile && window.turnstile.ready) {
      window.turnstile.ready(renderTurnstile);
    }
    // Cleanup: remove widget on unmount
    return () => {
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTokenReady(false); // Disable submit until new token is ready

    const token = window.turnstile.getResponse(widgetIdRef.current);
    if (!token) {
      alert("Please complete the Turnstile challenge.");
      return;
    }

    const response = await fetch(
      "https://cloudflare-workers.adheep.workers.dev",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          siteKey: SITE_KEY,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
    window.turnstile.reset(widgetIdRef.current);
  };

  console.log("v4.0 explicit-render-turnstile-widget");

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Turnstile</h1>
      {/* When you use explicit rendering (i.e., you call turnstile.render('#turnstile-container', ...)), 
          the widget can be rendered in any container you specify by ID or ref. 
          The container can be inside or outside the form. */}

      {/* In implicit mode, Turnstile automatically injects a hidden input into the form, so it needs to be inside the form to work seamlessly. */}
      {/* In explicit mode, you control everything, so the widget can be anywhere on the page. */}

      <div id="turnstile-container" ref={turnstileRef}></div>
      <form onSubmit={handleSubmit}>
        <div className="form-fields">
          <input type="text" name="dealerId" placeholder="Dealer ID" />
          <input type="email" name="email" placeholder="Email" />
          <input type="text" name="firstName" placeholder="First Name" />
          <input type="text" name="lastName" placeholder="Last Name" />
          <input type="tel" name="phoneNumber" placeholder="Phone Number" />
          <input type="text" name="address" placeholder="Address" />
          <input type="text" name="company" placeholder="Company" />
          <input type="text" name="initiative" placeholder="Initiative" />
          <input type="text" name="source" placeholder="Source" />
          <input type="text" name="leadType" placeholder="Lead Type" />
        </div>
        <button
          type="submit"
          value="Submit"
          disabled={!tokenReady}
          style={{
            backgroundColor: !tokenReady ? "#ccc" : "#646cff",
            color: !tokenReady ? "#888" : "#fff",
            cursor: !tokenReady ? "not-allowed" : "pointer",
            border: "none",
            padding: "0.6em 1.2em",
            borderRadius: "8px",
            fontSize: "1em",
            marginTop: "1em",
            transition: "background 0.2s, color 0.2s, cursor 0.2s",
          }}
        >
          Submit
        </button>
      </form>
    </>
  );
}

export default App;
