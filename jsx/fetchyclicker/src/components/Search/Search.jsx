import React from "react";
import "./Search.css"
import SearchResult from "../SearchResult/SearchResult";
import Spiner from "../Spiner/Spiner";
import { useState, useEffect } from "react";

export default function Search() {

    const [searchResults, setSearchResults] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("useEffect is running")
        const url = "https://api.github.com/search/repositories?q=react&per_page=100&page="+page;

        setLoading(true);
        fetch(url)
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(results => {
                setSearchResults(results.items);
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                alert("Oops, failed to fetch:(")
            });
    }, [page]);

    const incrementPage = () => {
        setPage(page => page + 1)
    }

    const decrementPage = () => {
        setPage(page => page - 1)
    }

    return (
        <div>
            <h2>Search! {page}</h2>
            {loading === true && <Spiner />}
            {loading === false && (
                <div>
                    {page > 1 && <button className="btn" onClick={decrementPage}>Previos</button>}
                    <button className="btn" onClick={incrementPage}>Next</button>
                    {searchResults?.map(repo => <SearchResult key={repo.id} repo={repo}/>)}
                </div>)}
        </div>
    )
}