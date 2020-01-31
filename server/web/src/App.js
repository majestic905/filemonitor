import React, {Fragment, useState, useEffect} from "react";
import cx from "classnames";
import fileSvg from "./images/receipt-24px.svg";
import folderSvg from "./images/folder-24px.svg";
import folderOpenSvg from "./images/folder_open-24px.svg";
import useFetch from "./useFetch";
import './App.scss';

const Loading = () => <div className="loading loading-lg"/>;

const Error = ({error}) => (
    <div className="toast toast-error">
        <div className="h1">Error</div>
        <div>{JSON.stringify(error, null, 2)}</div>
    </div>
);

const File = ({file, isSelected, selectFile}) => {
    return (
        <li>
            <span className={cx({'selected': isSelected})} onClick={() => selectFile(file)}>
                <img src={fileSvg} alt={file.name}/>
                <span>{file.name}</span>
            </span>
        </li>
    )
}

const Directory = ({tree, isRoot, activeFile, selectFile}) => {
    const [isOpened, setIsOpened] = useState(isRoot);

    if (tree.type === "F") {
        const isSelected = activeFile && (tree.path === activeFile.path);
        return <File selectFile={selectFile} isSelected={isSelected} file={tree}/>
    }

    return (
        <li className={cx({root: isRoot, opened: isOpened})}>
            <span onClick={() => setIsOpened((value) => !value)}>
                <img src={isOpened ? folderOpenSvg : folderSvg} alt={tree.name}/>
                <span>{tree.name}</span>
            </span>
            {isOpened && 
                <ul>
                    {tree.children.map(child => <Directory key={child.name} tree={child} activeFile={activeFile} selectFile={selectFile}/>)}
                </ul>
            }
        </li>
    )
}

const FileTree = ({activeFile, selectFile}) => {
    const [{isLoading, response, error}, doFetch] = useFetch("/tree");
    
    useEffect(doFetch, [doFetch]);

    if (isLoading)
        return <Loading />;

    if (error)
        return <Error error={error}/>;

    if (response)
        return (
            <div className="tree">
                <h2>File tree</h2>
                <ul id="file-tree-list">
                    <Directory tree={response} activeFile={activeFile} selectFile={selectFile} isRoot/>
                </ul>
            </div>
        );

    return null;
}

const Events = ({activeFile, selectFile}) => {
    const _events = [
        {
            timestamp: new Date(2020, 0, 1, 12, 0).toLocaleString(),
            files: [
                'storage/2cda104f-b7e8-443d-8e8b-4f325a981b12/RIPEngine.xml',
                'storage/2cda104f-b7e8-443d-8e8b-4f325a981b12/Meta/00001.xml'
            ]
        },
        {
            timestamp: new Date(2020, 0, 1, 12, 22).toLocaleString(),
            files: [
                'storage/03a2fd11-d5d6-40f5-8b8d-5cf1ac7b4ece/Settings.xml',
                'storage/03a2fd11-d5d6-40f5-8b8d-5cf1ac7b4ece/Meta/info.xml'
            ]
        }
    ]

    const events = _events.map(event => ({
        ...event,
        type: 'D',
        name: `[${event.timestamp}] ${event.files.length} file${event.files.length > 1 ? 's' : ''} changed`,
        children: event.files.map(file => ({type: 'F', path: file, name: file}))
    }));

    return (
        <div id="events" className="tree">
            <h2>Events</h2>
            <ul id="events-list">
                {events.map(event => <Directory key={event.timestamp} tree={event} activeFile={activeFile} selectFile={selectFile}/>)}
            </ul>
        </div>
    )
}

const HighlightedXmlFile = ({file}) => {
    const [{isLoading, response, error}, doFetch] = useFetch("/file");

    useEffect(() => {
        if (file)
            doFetch({params: {path: file.path}});
    }, [doFetch, file]);

    useEffect(() => {
        const timer = setTimeout(() => window.Prism.highlightAll(), 2);
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


const App = () => {
    const [activeFile, setActiveFile] = useState(null);

    return (
        <div className="columns">
            <div className="column col-4">
                <Events activeFile={activeFile} selectFile={setActiveFile}/>
                <FileTree activeFile={activeFile} selectFile={setActiveFile}/>
            </div>
            <div id="code-wrapper" className="column col-8">
                <HighlightedXmlFile file={activeFile}/>
            </div>
        </div>
    )
}

export default App;