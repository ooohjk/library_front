import "./style.css";
import BeforeLogin from "./beforeLogin";
import AfterLogin from "./afterLogin";
import React from "react";
import Search from "./search";

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
                <Search/>
            </div>
        </div>
    );
}