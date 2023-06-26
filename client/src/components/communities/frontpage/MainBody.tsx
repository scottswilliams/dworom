import { useState } from 'react';
import { IThreadDatabaseProps, Thread, ThreadType } from '../../threads/Thread';
import './MainStyles.css';

export const MainBody  = () =>
{
    const [activeRef, setActiveRef] = useState<React.MutableRefObject<undefined>>();

    const sampleThread1: IThreadDatabaseProps =
    {
        id: "1",
        community: "neoliberal",
        author: "iloveoof",
        title: "Discussion Thread",
        score: 3,
        threadType: ThreadType.link,
        submissionTime: new Date("Sun Jun 18 2023 18:31:29 GMT-0500 (Central Daylight Time)" ),
        myVote: -1,
        link: "https://www.reddit.com/r/neoliberal/comments/14cdmfm/discussion_thread/",
    }
    return <div className="mainBody">
        <div className="threadsContainer">
            <Thread activeRef={activeRef} setActiveRef={setActiveRef} databaseProps={sampleThread1}/>
            <Thread activeRef={activeRef} setActiveRef={setActiveRef} databaseProps={sampleThread1}/>
        </div>
    </div>
}