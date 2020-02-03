import React, {useEffect} from "react";
import useFetch from "../hooks/useFetch";
import Directory from "./directory";
import Loading from "./loading";
import Error from "./error";

// response = {
//     type: "D",
//     name: "storage",
//     children: [
//         {
//             type: "D",
//             name: "03a2fd11-d5d6-40f5-8b8d-5cf1ac7b4ece",
//             children: [
//                 {
//                     type: "F",
//                     name: "RIPEngine.xml"​​,
//                     mtime: "2020-01-30T12:22:36.524Z",
//                     size: 174701,​​​
//                 }
//             ]
//         }
//     ]
// }

const FileTree = () => {
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
                    <Directory tree={response} isRoot/>
                </ul>
            </div>
        );

    return null;
}

export default FileTree;