import React from "react";

const Error = ({error}) => (
    <div className="toast toast-error">
        <div className="h1">Error</div>
        <div>{JSON.stringify(error, null, 2)}</div>
    </div>
);

export default Error;