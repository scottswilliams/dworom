import './Sidebar.css';

export const SidebarHeader = () =>
{
    return <div className="sidebarHeader">
        <div className="sidebarCommunityTitle">
            The <span className="communityTitle">Dworom</span> Community
        </div>
        <div className="creationButtons">
            <a href="#createThread" className="sidebarButtonLink"><button className="sidebarButton">Create a Thread</button></a>
        </div>
    </div>
}

export default SidebarHeader;