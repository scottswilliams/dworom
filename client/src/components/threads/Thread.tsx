import React, { useRef } from 'react';
import './Thread.css';
import { Link } from 'react-router-dom';

export enum ThreadType 
{
    text,
    link,
}
interface IThreadProps 
{
    activeRef?: React.MutableRefObject<undefined> | undefined,
    setActiveRef?: React.Dispatch<React.SetStateAction<React.MutableRefObject<undefined> | undefined>>
    databaseProps: IThreadDatabaseProps | null;
    inComments: boolean;
}

export interface IThreadDatabaseProps
{
    id: string,
    community_name: string,
    author_username: string,
    title: string,
    creation_date: Date,
    link?: string,
    thumbnail?: string;
    body?: string,
}

export const Thread = (props: IThreadProps | null) =>
{
    const ref = useRef();

    if (!props?.databaseProps)
    {
        return null;
    }

    const thumbnail = props.databaseProps.thumbnail ? props.databaseProps.thumbnail : "https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg";
    
    return <div className="threadContainer" onClick={() => props.setActiveRef!(ref)} onFocus={() => props.setActiveRef!(ref)} tabIndex={0}>
        <div className={"thread"+ activeRefClassOrNull(ref, props.activeRef)}>
            <div className="threadThumbnail">
                <img alt="" src={thumbnail} height="50px" width="50px"></img>
            </div>
            <div className="threadTitle">
                <a className="threadLink" href={props.databaseProps.link}>{props.databaseProps.title}</a>
            </div>
            <div className="threadInfo">
                <span className="threadInfo">by <span className="threadAuthor">{props.databaseProps.author_username}</span> in community <span className="threadCommunity">{props.databaseProps.community_name}</span> at <span className="threadTimestamp">{new Date(props.databaseProps.creation_date).toLocaleString()}</span> </span>
            </div>
                <div className="threadButtons">
                    <div className="threadComments">
                        {props.inComments ? 
                        <Link to={"/c/" + props.databaseProps.community_name + "/threads/" + props.databaseProps.id}><button>Comments</button></Link>
                        : null }
                    </div>
                    <div className="threadDislike"><button>Like</button></div>
                    <div className="threadLike"><button>Dislike</button></div>     
                </div>
            </div>
        </div>;
}

const activeRefClassOrNull = (ref: React.MutableRefObject<undefined>, activeRef: React.MutableRefObject<undefined> | undefined) =>
{
    return (ref === activeRef) ? " threadContainerActive" : ""
}