import { useState } from "react";
export default function SignIn() {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [clientError, setClientError] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (Name.trim().length == 0) {
      errors.Name = "Name is required";
    }
    if (Email.trim().length == 0) {
      errors.Email = "Email is required";
    }
    console.log(errors);
    if (Object.keys(errors).length != 0) {
      console.log("form error", errors);
      setClientError(errors);
    }
    setName("");
    setEmail("");
    console.log(Name);
    console.log(Email);
  };
  return (
    <div>
      <h3>Login form</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            placeholder="Enter the name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              if (Name.trim().length == 0) {
                setClientError({ ...Name, Name: "Name is required" });
              }
            }}
            onFocus={() => {
              setClientError({ Name: "" });
            }}
          />
          {clientError.Name && (
            <span style={{ color: "red" }}>{clientError.Name}</span>
          )}
        </div>
        <div>
          <label>Email: </label>
          <input
            type="email"
            placeholder="Enter the Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              if (Email.trim().length == 0) {
                setClientError({ ...Email, Email: "Email is required" });
              }
            }}
            onFocus={() => {
              setClientError({ Email: "" });
            }}
          />
          {clientError.Email && (
            <span style={{ color: "red" }}>{clientError.Email}</span>
          )}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
