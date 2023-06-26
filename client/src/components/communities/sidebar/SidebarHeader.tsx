import { Link, Route, Routes } from 'react-router-dom';
import './Sidebar.css';

export const SidebarHeader = () =>
{
    return <div className="sidebarHeader">
        <div className="sidebarCommunityTitle">
            The <span className="communityTitle">Dworom</span> Community
        </div>
        <Routes>
            <Route path="/" element={
                <div className="creationButtons">
                    <Link to="/createthread" className="sidebarButtonLink"><button className="sidebarButton">Create a Thread</button></Link>
                </div>
            }>
            </Route>
            <Route path="/createthread">
            </Route>
        </Routes>
    </div>
}

export default SidebarHeader;