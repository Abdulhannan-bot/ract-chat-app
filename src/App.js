// import logo from './logo.svg';
// import React, { useState, useEffect } from 'react';
// import firebase from 'firebase/app';
// import 'firebase/database';

// const firebaseConfig = {
//   // Your Firebase configuration object
// };

// firebase.initializeApp(firebaseConfig);

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const messagesRef = firebase.database().ref('messages');
//     messagesRef.on('value', snapshot => {
//       const messagesData = snapshot.val();
//       if (messagesData) {
//         const messagesArray = Object.entries(messagesData).map(([key, value]) => {
//           return { id: key, ...value };
//         });
//         setMessages(messagesArray);
//       }
//     });
//   }, []);

//   const handleSendMessage = () => {
//     if (message) {
//       const newMessageRef = firebase.database().ref('messages').push();
//       newMessageRef.set({ message: message, timestamp: Date.now() });
//       setMessage('');
//     }
//   };
//   return (
//     <div className="App">
//       <h1>Chat App</h1>
//       <ul>
//         {messages.map(message => (
//           <li key={message.id}>
//             <span>{message.message}</span>
//             <span>{new Date(message.timestamp).toLocaleString()}</span>
//           </li>
//         ))}
//       </ul>
//       <div>
//         <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

//////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useContext } from "react";

import Home from "./templates/js/Home";
import Login from "./templates/js/Login";
import RootApp from "./utils/RootApp";
import { AuthContext } from "./utils/AuthContext";
import { AuthProvider } from "./utils/AuthContext";

// function RootApp() {
//   const userInfo = useContext(AuthContext);
//   return userInfo?.token ? <Home /> : <Login />;
// }

export default function App() {
  const userInfo = useContext(AuthContext);

  return (
    <AuthProvider>
      <RootApp />
    </AuthProvider>
  );
}
