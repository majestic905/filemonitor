import React from "react";
import {SelectedFilePathProvider} from "./contexts/selectedFilePath";
import Events from "./components/events";
import FileTree from "./components/fileTree";
import HighlightedXmlFile from "./components/highlightedXmlFile";
import './App.scss';

const App = () => {
    return (
        <SelectedFilePathProvider>
            <div className="columns">
                <div className="column col-4">
                    <Events/>
                    <FileTree/>
                </div>
                <div id="code-wrapper" className="column col-8">
                    <HighlightedXmlFile/>
                </div>
            </div>
        </SelectedFilePathProvider>
    )
}

export default App;