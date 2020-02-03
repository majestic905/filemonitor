import React, {useEffect} from "react";
import useFetch from "../hooks/useFetch";
import Directory from "./directory";
import Loading from "./loading";
import Error from "./error";

const Events = () => {
    const [{isLoading, response, error}, doFetch] = useFetch("/events");

    useEffect(doFetch, [doFetch]);

    if (isLoading)
        return <Loading/>;

    if (error)
        return <Error error={error}/>;

    if (!response)
        return null;

    const events = response.map(event => ({
        ...event,
        type: 'D',
        name: `[${event.timestamp}] ${event.files.length} file${event.files.length > 1 ? 's' : ''} changed`,
        children: event.files.map(file => ({type: 'F', path: file, name: file}))
    }));

    return (
        <div id="events" className="tree">
            <h2>Events</h2>
            <ul id="events-list">
                {events.map(event => <Directory key={event.timestamp} tree={event}/>)}
            </ul>
        </div>
    )
}

export default Events;