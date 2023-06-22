import { useContext, useState } from 'react';
import './LoginOrRegisterStyles.css';
import axios from 'axios';
import { AuthContext } from '../Home';

const LoginOrRegisterBanner = () =>
{
  const authContext = useContext(AuthContext);

  const loggedIn = authContext.token != null;

  if (loggedIn)
  {
      return <LogoutButton />
  }

  else
  {
      return <>
      <LoginButton />
      <span className="mainUserBannerItem separator">⋅</span>
      <RegisterButton />
      </>
  }
}

export default LoginOrRegisterBanner;

const LoginButton = () =>
{ 
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

   return <>
    <button onClick={handleOpen} className="mainUserBannerItem linkButton loginButton">Log In</button>
    <LoginModal isOpen={isOpen} handleClose={handleClose} />
   </>
    
}

const LogoutButton = () =>
{
  const authContext = useContext(AuthContext);
  const resetAuthContext = () =>
  {
    authContext.setToken(null);
    authContext.setUsername(null);
  }
  return <button className="mainUserBannerItem linkButton loginButton" onClick={resetAuthContext}>Log Out</button>
}

const RegisterButton = () =>
{  
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return <>
    <button onClick={handleOpen} className="mainUserBannerItem linkButton registerButton">Register</button>
    <RegistrationModal isOpen={isOpen} handleClose={handleClose} />
  </>
}

interface IModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

const RegistrationModal: React.FC<IModalProps> = ({ isOpen, handleClose }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleRegister = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
  
    try {
      await axios.post('http://localhost:5000/api/register', { username, email, password });
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`modal-wrapper ${isOpen ? 'show-modal' : 'hide-modal'}`}>
      <div className="modal-content">
        <span className="close-button" onClick={handleClose}>&#10006;</span>
        <span className="modal-title">Register</span>
        <input 
          type="text" 
          className="input-field"
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password"
          className="input-field"
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
        />
        <input 
          type="email" 
          className="input-field"
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleRegister} className="register-button">Register</button>
      </div>
    </div>
  );
}

const LoginModal: React.FC<IModalProps> = ({ isOpen, handleClose }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const authContext = useContext(AuthContext);
  
  const handleLogin = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
  
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username, password });
      authContext.setToken(res.data.token);
      authContext.setUsername(username);
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`modal-wrapper ${isOpen ? 'show-modal' : 'hide-modal'}`}>
      <div className="modal-content">
        <span className="close-button" onClick={handleClose}>&#10006;</span>
        <span className="modal-title">Log In</span>
        <input 
          type="text" 
          className="input-field"
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password"
          className="input-field"
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} className="register-button">Log In</button>
      </div>
    </div>
  );
}