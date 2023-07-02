import { TextEditor } from "./TextEditor";
import './EditorStyles.css';
import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Home";

interface ICommentProps
{
    threadId: string,
    parentCommentId: string | null,
}
export const CommentEditor = (props: ICommentProps) =>
{
    const [commentBodyHTML, setCommentBodyHTML] = useState<string | null>(null);
	const authContext = useContext(AuthContext);

    const submitComment = async (threadId: string, parentCommentId: string | null, commentBodyHTML: string | null) =>
    {
        if (commentBodyHTML == null)
        {
            return null;
        }

		return await axios.post("http://localhost:5000/api/submitComment", [threadId, parentCommentId,  commentBodyHTML, authContext.token]);
    }

    return <div className="commentBox">
        <TextEditor setTextField={setCommentBodyHTML} />
        <div className="threadPostComment">
            <button onClick={() => submitComment(props.threadId, props.parentCommentId, commentBodyHTML)}>Comment</button>
        </div>
    </div>
}