import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const SITE_KEY = "0x4AAAAAABg8fBKvm3kslBsU";
  const [tokenReady, setTokenReady] = useState(false);

  // Register the callback globally (for implicit mode)
  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    window.onTurnstileSuccess = function (token) {
      setTokenReady(true);
    };
    // Clean up
    return () => {
      delete window.onTurnstileSuccess;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTokenReady(false); // Disable submit until new token is ready

    const token = event.target["cf-turnstile-response"]?.value;
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
    console.log(window.turnstile.reset());
  };

  console.log("v3 implicit turnstile widget rendering");

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
        <div
          className="cf-turnstile"
          data-sitekey={SITE_KEY}
          data-callback="onTurnstileSuccess"
        ></div>
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
