import { useContext } from 'react';
import { AuthContext } from '../Home';
import LoginOrRegisterBanner from '../authentication/LoginOrRegister/LoginOrRegisterBanner'
import './MainHeader.css'

export const UserBanner = () =>
{
    const authContext = useContext(AuthContext);
    
    return <div className="mainHeaderBody">
        <span className="mainUserBanner">
            {authContext.token != null ? <LoggedInUserHeader /> : null }
            <LoginOrRegisterBanner />
        </span>
    </div>
}

const LoggedInUserHeader = () =>
{
    const authContext = useContext(AuthContext);
    
    return <>
        <button className="mainUserBannerItem linkButton"><span className="username">{authContext.username}</span></button>
        <button className="mainUserBannerItem linkButton">Inbox</button>
    </>
}