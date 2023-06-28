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
    community_id: string,
    author_id: string,
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
                <div className="threadInfoAuthor">{props.databaseProps.author_id}</div>
            </div>
        </div>
    </div>;
}

const activeRefClassOrNull = (ref: React.MutableRefObject<undefined>, activeRef: React.MutableRefObject<undefined> | undefined) =>
{
    return (ref === activeRef) ? " threadContainerActive" : ""
}