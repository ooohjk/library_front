import "./style.css";
import BeforeLogin from "./beforeLogin";
import AfterLogin from "./afterLogin";
import React from "react";
import Search from "./search";
import { useCookies } from "react-cookie";

export default function Main() {

    const [cookie] = useCookies(["accessToken", "userNo", "userId"]);

    if ((cookie.accessToken && cookie.userNo && cookie.userId) !== undefined) {
        localStorage.setItem("accessToken", cookie.accessToken);
        localStorage.setItem("userNo", cookie.userNo);
        localStorage.setItem("userId", cookie.userId);
    }

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