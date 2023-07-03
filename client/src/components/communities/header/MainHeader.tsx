import { Link } from 'react-router-dom';
import './MainHeader.css';
import { UserBanner } from './UserBanner';

export const MainHeader  = () =>
{
    return <div className="mainHeader" role="banner">
        <Link to="/"><div className="mainLogo"><h2>Dworom</h2></div></Link>
        <UserBanner />
    </div>
}