import React, {useContext, useEffect} from "react";
import {SelectedFilePathContext} from "../contexts/selectedFilePath";
import useFetch from "../hooks/useFetch";
import Loading from "./loading";
import Error from "./error";

const HighlightedXmlFile = () => {
    const [{isLoading, response, error}, doFetch] = useFetch("/file");
    const [selectedFilePath,] = useContext(SelectedFilePathContext);

    useEffect(() => {
        if (selectedFilePath)
            doFetch({params: {path: selectedFilePath}});
    }, [doFetch, selectedFilePath]);

    useEffect(() => {
        const timer = setTimeout(() => window.Prism.highlightAll(), 10);
        return () => {
            clearTimeout(timer);
        }
    }, [response]);

    if (isLoading)
        return <Loading />;

    if (error)
        return <Error error={error}/>;
    
    if (response)
        return <pre><code className="language-xml">{response}</code></pre>;

    return null;
}

export default HighlightedXmlFile;