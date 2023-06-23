import './Sidebar.css';

export const SidebarHeader = () =>
{
    return <div className="sidebarHeader">
        <div className="sidebarCommunityTitle">
            The <span className="communityTitle">Dworom</span> Community
        </div>
        <div className="creationButtons">
            <button className="sidebarButton">Create a Thread</button>
            <button className="sidebarButton">Create a Community</button>
        </div>
    </div>
}

export default SidebarHeader;