import './Comments.css';
import { ReadOnlyTextEditor } from "../textinput/TextEditor";
import { useState } from 'react';
import { CommentEditor } from '../textinput/CommentEditor';
import CommentsRepeater from './CommentsRepeater';
import { VoteState, VotingBox } from '../voting/VotingBox';

export interface ICommentProps 
{
    activeRef?: React.MutableRefObject<undefined> | undefined,
    setActiveRef?: React.Dispatch<React.SetStateAction<React.MutableRefObject<undefined> | undefined>>,
    databaseProps: ICommentDatabaseProps | null,
    threadId: string,
    commentDepth: number,
    isCollapsed: boolean,
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

    return <div className={"commentContainer" + ((props.commentDepth % 2) === 0 ? " darkerContainer" : "")}>
        <div className="commentVoteInfoAndBodyContainer">
            <div className={(props.isCollapsed ? "nodisp" : "")}><VotingBox voteState={VoteState.None} /></div>
            
            <div className="commentInfoAndBodyContainer">
                <div className="commentInfoBar">
                    <span className="commentUsername">{props.databaseProps?.author_username}</span> at <span className="commentDate">{creationDate.toLocaleTimeString()}</span>
                </div>
                <div className={"commentBody" + (props.isCollapsed ? " nodisp" : "")}><ReadOnlyTextEditor body={props.databaseProps?.body}/></div>
            </div>
        </div>
        <div className={"commentRepliesContainer" + (props.isCollapsed ? " nodisp" : "")}>
            <div className="commentButtons">
                <button className="commentButton" onClick={() => setShowReplyBox(!showReplyBox)}>{showReplyBox ? "Cancel" : "Reply"}</button>
            </div>
            <div className={"commentReplyBox " + (showReplyBox ? "" : "nodisp")}>
                <CommentEditor threadId={props.threadId} parentCommentId={props.databaseProps?.id!} />
            </div>
            <CommentsRepeater threadId={props.threadId} parentCommentId={props.databaseProps?.id!} commentDepth={props.commentDepth + 1} />
        </div>
    </div>

}

export const CommentContainer = (props: ICommentProps) =>
{
    const [isCollapsed,setIsCollapsed] = useState<boolean>(false);

    return <div className="commentCollapseContainer">
                <div className="commentCollapseButtonContainer" onClick={() => setIsCollapsed(!isCollapsed)}>
                  <div className={"commentCollapseButton " + (isCollapsed ? " collapsed" : "")}></div>
                  <div className="commentCollapseBar"></div>
                </div>
                <Comment threadId={props.threadId!} setActiveRef={props.setActiveRef} activeRef={props.activeRef} databaseProps={props.databaseProps} commentDepth={props.commentDepth} isCollapsed={isCollapsed}/>
              </div>
}