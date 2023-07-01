import { useLoaderData, useParams } from "react-router-dom";
import { IThreadDatabaseProps, Thread } from "./Thread";
import { useEffect, useState } from "react";
import axios from "axios";


export const ThreadComments = () =>
{
    let { community, id } = useParams();
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
        setIsLoading(false); // Set loading to false after fetching data
        }
    };

    // Call the fetchData function
    fetchData();
    }, [id]); // The effect depends on the 'id' parameter, re-run if 'id' changes

    // While the data is loading, you can return a loading message
    if (isLoading) {
    return <div>Loading...</div>;
    }

    return <div>
            <Thread databaseProps={data} inComments={false}></Thread>
            <p>{data?.body}</p>
        </div>
}