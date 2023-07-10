import { useCallback, useEffect, useRef, useState } from "react";
import { Comment, CommentContainer, ICommentDatabaseProps } from "./Comment";
import axios, { AxiosResponse } from "axios";

interface ICommentsRepeaterProps
{
  threadId: string,
  parentCommentId?: string,
  commentDepth: number,
}

export const CommentsRepeater = (props: ICommentsRepeaterProps) => 
{
    const [comments, setComments] = useState<ICommentDatabaseProps[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const requestedPages = useRef(new Set<number>());
  
    const observer = useRef<IntersectionObserver>();
    const lastThreadElementRef = useCallback(
      (node: HTMLDivElement) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prevPage) => prevPage + 1);
          }
        });
        if (node) observer.current.observe(node);
      },
      [isLoading, hasMore]
    );
  
    useEffect(() => {
        const fetchComments = async (pageNumber: number) => {
            let query;
            if (props.parentCommentId)
            {
                query = `http://localhost:5000/api/thread/${props.threadId}/comments/${props.parentCommentId}`
            }

            else
            {
                query = `http://localhost:5000/api/thread/${props.threadId}/comments`
            }

            setIsLoading(true);

            try {
                const response = await axios.get(query, {
                        params: { page: pageNumber },
                        });

                setComments((prevComments) => [...prevComments, ...response.data]);

                setHasMore(response.data.length > 0);

            } catch (error) {
                console.error("Error fetching data: ", error);
            }
            setIsLoading(false);
          };

        if (!requestedPages.current.has(page)) {
            fetchComments(page);
            requestedPages.current.add(page);
        }
    }, [page, props.threadId, props.parentCommentId]);

    return (
      <div>
        {comments.map((comment, index) => (
          <div key={comment.id} ref={(comments.length === index + 1) ? lastThreadElementRef : null}>
              <CommentContainer databaseProps={comment} threadId={props.threadId} commentDepth={props.commentDepth} isCollapsed={false} />
            </div>
        ))}
        {isLoading && 'Loading...'}
      </div>
    );
  };
  
  export default CommentsRepeater;
  