import './MainStyles.css';
import ThreadRepeater from '../../threads/ThreadRepeater';

export const MainBody  = () =>
{
    return <div className="mainBody">
        <div className="threadsContainer">
            <ThreadRepeater />
        </div>
    </div>
}