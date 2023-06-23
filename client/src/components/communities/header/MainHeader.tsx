import './MainHeader.css';
import { UserBanner } from './UserBanner';

export const MainHeader  = () =>
{
    return <div className="mainHeader" role="banner">
        <div className="mainLogo"></div>
        <UserBanner />
    </div>
}