import React from "react";


export default function SearchResult(props) {
    const repo = props.repo
    const {id, full_name} = props;

    return(
        // <li key={id}>
            <div>
                {repo.full_name} <a href={repo.html_url}>Open repo</a>
            </div>
        // </li>
    )
    
}