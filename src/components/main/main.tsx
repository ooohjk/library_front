import "./style.css";
import BeforeLogin from "./beforeLogin";
import AfterLogin from "./afterLogin";
import React, { useState } from "react";

export default function Main() {

    let headers;
    if(localStorage.getItem("accessToken") === null) {
        headers = <BeforeLogin/>
    } else {
        headers = <AfterLogin/>
    }

    return (
        <div className="mainScreen">
            <div className="mainHeader">
                {headers}
            </div>
            <div className="mainBody">
                <div className="searchBox">
                    도서 검색: <input type="text" className="searchText"/><button className="searchButton">검색</button>
                </div>
            </div>
        </div>
    );
}