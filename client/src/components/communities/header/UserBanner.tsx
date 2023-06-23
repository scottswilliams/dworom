import { useContext } from 'react';
import { AuthContext } from '../Home';
import LoginOrRegisterBanner from '../LoginOrRegister/LoginOrRegisterBanner'
import './MainHeader.css'

export const UserBanner = () =>
{
    const authContext = useContext(AuthContext);
    
    return <div className="mainHeaderRight">
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
        <span className="mainUserBannerItem separator">⋅</span>
        <button className="mainUserBannerItem linkButton">Inbox</button>
        <span className="mainUserBannerItem separator">⋅</span>
    </>
}