import {useState} from "react";


export default function RegisterPage() {
  console.log("herer")
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
 
  async function register(ev) {
    ev.preventDefault();
    if (!username || !password) {
      alert('Please fill in both fields.');
      return; 
    }
    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      body: JSON.stringify({username,password}),
      headers: {'Content-Type':'application/json'},
    });
    if (response.status === 200) {
      alert('registration successful');
      window.location.href= '/login';
    } else {
      alert('registration failed');
    }
  }

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input type="email"
             placeholder="username"
             value={username}
             onChange={ev => setUsername(ev.target.value)}/>
      <input type="password"
             placeholder="password"
             value={password}
             onChange={ev => setPassword(ev.target.value)}/>
      <button>Register</button>
    </form>
  );
}