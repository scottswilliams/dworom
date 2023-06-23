import { MainBody } from "./frontpage/MainBody"
import { MainHeader } from "./header/MainHeader"
import  './HomeStyles.scss'
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const Home = () =>
{
    const initialToken = localStorage.getItem('jwtToken');
    const initialUsername = localStorage.getItem('username');

    const [token, setToken] = useState<string | null>(initialToken);
    const [username, setUsername] = useState<string | null>(initialUsername);

    useEffect(() =>
    {
        const verifyToken = async () => {
            if (!initialToken) return;
      
            try {
              const response: any = await axios.get('http://localhost:5000/api/verifyToken', {
                headers: { Authorization: `Bearer ${initialToken}` },
              });
      
              if (response.status === 200) {
                setUsername(initialUsername);
              } else {
                setToken(null);
              }
            } catch (error) {
              console.error('Token verification failed', error);
              setToken(null);
            }
          };
      
          verifyToken();
    });

    useEffect(() => {
        if (token) {
          localStorage.setItem('jwtToken', token);
        } 
        else {
          localStorage.removeItem('jwtToken');
          setUsername(null);
        }
      }, [token]);

      useEffect(() => {
        if (username) {
          localStorage.setItem('username', username);
        } 
        else {
          localStorage.removeItem('username');
        }
      }, [username]);

    return <AuthContext.Provider value={{ token, setToken, username, setUsername }}>
        <div className="mainContainer">
            <MainHeader />
            <MainBody />
        </div>
    </AuthContext.Provider>
}

export default Home;

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  username: string | null;
  setUsername: (user: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({ token: null, setToken: () => {},  username: null, setUsername: () => {}});


export { AuthContext };