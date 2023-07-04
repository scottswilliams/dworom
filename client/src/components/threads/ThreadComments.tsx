import { useParams } from "react-router-dom";
import { IThreadDatabaseProps, Thread } from "./Thread";
import { useEffect, useState } from "react";
import axios from "axios";
import { CommentEditor } from "../communities/textinput/CommentEditor";
import CommentsRepeater from "../communities/comments/CommentsRepeater";


export const ThreadComments = () =>
{
    let { id } = useParams();
      // Create state variables to store the data fetched and loading status
    const [data, setData] = useState<IThreadDatabaseProps | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Use the useEffect hook to make an Axios GET request when the component mounts
    useEffect(() => {
    const fetchData = async () => {
        try {
        const response = await axios.get(`http://localhost:5000/api/thread/${id}`);
        // Store the response data in the state
        setData(response.data);
        } catch (error) {
        console.error('Error fetching data:', error);
        } finally {
        setIsLoading(false);
        }
    };

    fetchData();
    }, [id]);

    if (isLoading) {
    return <div>Loading...</div>;
    }

    return <div>
            <Thread databaseProps={data} inComments={false} showBody={true}></Thread>
            <div className="threadTopLevelCommentBox">
              <CommentEditor threadId={id!} parentCommentId={null} />
            </div>
			<CommentsRepeater threadId={id!} commentDepth={1} />
        </div>
}