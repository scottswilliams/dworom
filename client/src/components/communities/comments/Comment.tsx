import './Comments.css';
import { ReadOnlyTextEditor } from "../textinput/TextEditor";
import { useState } from 'react';
import { CommentEditor } from '../textinput/CommentEditor';
import CommentsRepeater from './CommentsRepeater';

export interface ICommentProps 
{
    activeRef?: React.MutableRefObject<undefined> | undefined,
    setActiveRef?: React.Dispatch<React.SetStateAction<React.MutableRefObject<undefined> | undefined>>,
    databaseProps: ICommentDatabaseProps | null,
    threadId: string,
    commentDepth: number,
}

export interface ICommentDatabaseProps
{
    id: string,
    author_username: string,
    body: string,
    creation_date: Date,
}

export const Comment = (props: ICommentProps) =>
{
    const [showReplyBox, setShowReplyBox] = useState<boolean>(false);

    const creationDate = new Date(props.databaseProps?.creation_date!);

    return <div className={"commentContainer" + ((props.commentDepth % 2) === 0 ? " darkerCommentContainer" : "")}>
        <div className="commentInfoBar">
            <span className="commentUsername">{props.databaseProps?.author_username}</span> at <span className="commentDate">{creationDate.toLocaleTimeString()}</span>
        </div>
        <div className="commentBody"><ReadOnlyTextEditor body={props.databaseProps?.body}/></div>
        <div className="commentButtons">
            <button className="commentButton" onClick={() => setShowReplyBox(!showReplyBox)}>{showReplyBox ? "Cancel" : "Reply"}</button>
        </div>
        <div className={"commentReplyBox " + (showReplyBox ? "" : "nodisp")}>
            <CommentEditor threadId={props.threadId} parentCommentId={props.databaseProps?.id!} />
        </div>
        <CommentsRepeater threadId={props.threadId} parentCommentId={props.databaseProps?.id!} commentDepth={props.commentDepth + 1} />
    </div>
}