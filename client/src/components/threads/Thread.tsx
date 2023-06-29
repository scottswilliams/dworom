import React, { useRef } from 'react';
import './Thread.css';

export enum ThreadType 
{
    text,
    link,
}
interface IThreadProps 
{
    activeRef: React.MutableRefObject<undefined> | undefined,
    setActiveRef: React.Dispatch<React.SetStateAction<React.MutableRefObject<undefined> | undefined>>
    databaseProps: IThreadDatabaseProps
}

export interface IThreadDatabaseProps
{
    id: string,
    community_name: string,
    author_username: string,
    title: string,
    creation_date: Date,
    link?: string,
}

export const Thread = (props: IThreadProps) =>
{
    const ref = useRef();
    
    return <div className="threadContainer">
        <div className={"thread" + activeRefClassOrNull(ref, props.activeRef)} onClick={() => props.setActiveRef(ref)}>
            <div className="threadThumbnail">
                <img alt="" src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg" height="50px" width="50px"></img>
            </div>
            <div className="threadTitle">
                <a className="threadLink" href={props.databaseProps.link}>{props.databaseProps.title}</a>
            </div>
            <div className="threadInfo">
                <span className="threadInfo">by <span className="threadAuthor">{props.databaseProps.author_username}</span> in community <span className="threadCommunity">{props.databaseProps.community_name}</span> at <span className="threadTimestamp">{new Date(props.databaseProps.creation_date).toLocaleString()}</span> </span>
            </div>
        </div>
    </div>;
}

const activeRefClassOrNull = (ref: React.MutableRefObject<undefined>, activeRef: React.MutableRefObject<undefined> | undefined) =>
{
    return (ref === activeRef) ? " threadContainerActive" : ""
}