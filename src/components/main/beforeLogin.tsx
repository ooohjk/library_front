import { useNavigate } from "react-router-dom";
import "./style.css";
import React from "react";

const BeforeLogin = () => {

    const navigate = useNavigate();

    const loginOnClick = () => {
        console.log("로그인 버튼 클릭!");
        navigate("/login");
    }

    const joinOnClick = () => {
        console.log("회원가입 버튼 클릭!");
        navigate("/join");
    }

    return (
        <>
            <div className="home">
                <div onClick={() => navigate("/")}>Home</div>
            </div>
            <div className="joinButtonBox">
                <button className="joinButton" onClick={joinOnClick}>회원가입</button>
            </div>
            <div className="loginButtonBox">
                <button className="loginButton" onClick={loginOnClick}>로그인</button>
            </div>
        </>
    );
}

export default BeforeLogin