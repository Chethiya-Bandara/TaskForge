import { useEffect, useState } from "react";

function App() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/contacts")
      .then((res) => res.json())
      .then((data) => setContacts(data));
  }, []);

  return (
    <div>
      <h1>React Frontend</h1>

      {contacts.map((contact, index) => (
        <p key={index}>{contact}</p>
      ))}
    </div>
  );
}

export default App;