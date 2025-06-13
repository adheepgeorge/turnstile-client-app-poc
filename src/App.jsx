import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Submitted");
    // Get the token from the hidden input
    // For the default (implicit) Turnstile integration—where y
    // ou simply add the <div className="cf-turnstile" ...> and the script—you
    // do not need to await anything to get the token.
    //  The widget automatically injects the hidden input (cf-turnstile-response) into your form
    // once the challenge is solved,
    // and the value is available synchronously on submit.
    const token = event.target["cf-turnstile-response"]?.value;
    console.log("Turnstile token:", token);
    // You can now send this token to your backend for verification
  };

  const SITE_KEY = "0x4AAAAAABg8fBKvm3kslBsU";
  console.log("v1");

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
        <div className="cf-turnstile" data-sitekey={SITE_KEY}></div>
        <button type="submit" value="Submit">
          Submit
        </button>
      </form>
    </>
  );
}

export default App;
