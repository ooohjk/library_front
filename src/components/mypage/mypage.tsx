import "./style.css";
import AfterLogin from "../main/afterLogin";
import { useState } from "react";
import State from "./state/state";
import History from "./history/history";
import Hearts from "./hearts/hearts";

export default function MyPage() {

    const [content, setContent] = useState("rentStateOnClick");

    const rentStateOnClick = () => {
        setContent("rentStateOnClick");
    }

    const rentLogOnClick = () => {
        setContent("rentLogOnClick");
    }

    const heartListOnClick = () => {
        setContent("heartListOnClick");
    }

    return (
        <div className="myPageScreen">
            <div className="myPageHeader">
                <AfterLogin/>
                <div className="myPageMenu">
                    <div className="rentState">
                        <button className="rentStateButton" onClick={rentStateOnClick}>대출 현황</button>
                    </div>
                    <div className="rentLog">
                        <button className="rentLogButton" onClick={rentLogOnClick}>대출 이력</button>
                    </div>
                    <div className="heartList">
                        <button className="heartListButton" onClick={heartListOnClick}>찜 목록</button>
                    </div>
                    <div className="none"></div>
                </div>
            </div>
            <div className="myPageBody">
                <div className="myPageContent">
                    {content === "rentStateOnClick" && (
                        <State/>
                    )}
                    {content === "rentLogOnClick" && (
                        <History/>
                    )}
                    {content === "heartListOnClick" && (
                        <Hearts/>
                    )}
                </div>
            </div>
        </div>
    );
}