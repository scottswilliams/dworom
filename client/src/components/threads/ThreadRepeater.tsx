import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { IThreadDatabaseProps, Thread } from './Thread';

export const ThreadComponent: React.FC = () => {
  const [threads, setThreads] = useState<IThreadDatabaseProps[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeRef, setActiveRef] = useState<React.MutableRefObject<undefined>>();
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
    if (!requestedPages.current.has(page)) {
      fetchThreads(page);
      requestedPages.current.add(page);
    }
  }, [page]);

  const fetchThreads = async (pageNumber: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/threads', {
        params: { page: pageNumber },
      });
      setThreads((prevThreads) => [...prevThreads, ...response.data]);
      setHasMore(response.data.length > 0);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      {threads.map((thread, index) => (
        <div key={thread.id} ref={threads.length === index + 1 ? lastThreadElementRef : null}>
            <Thread setActiveRef={setActiveRef} activeRef={activeRef} databaseProps={thread} inComments={true} />
        </div>
      ))}
      {isLoading && 'Loading...'}
    </div>
  );
};

export default ThreadComponent;
