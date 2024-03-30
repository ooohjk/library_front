import API from "../../apis/api";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AfterLogin = () => {

    const navigate = useNavigate();

    const logoutOnClick = () => {
        console.log("로그아웃 버튼 클릭!");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userNo");
        alert("로그아웃을 하였습니다.");
        navigate("/");
        window.location.reload();
    }

    const [profile, setProfile] = useState("");
    const getByUserid = async () => {
        await API.get(`/user/get/userId/${localStorage.getItem("userId")}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).catch((err) => {
            console.error(err);
        }).then((res) => {
            setProfile(res?.data.data.gender);
        })
    }

    if (localStorage.getItem("userId") !== null) {
        getByUserid().then(() => {
            // ....
        })
    }

    const iconOnClick = () => {
        console.log("마이페이지 아이콘 클릭!");
        navigate("/myPage");
    }

    return (
        <>
            <div className="home">
                <div onClick={() => navigate("/")}>Home</div>
            </div>
            <div className="quitLinkBox">
                <a href="/quit" className="quitLink">탈퇴하기</a>
            </div>
            <div className="profileIcon">
                {profile === "M" && (
                    <img src="/profile_1.png" alt="" className="manProfile" onClick={iconOnClick}/>
                )}
                {profile === "F" && (
                    <img src="/profile_2.png" alt="" className="womanProfile" onClick={iconOnClick}/>
                )}
            </div>
            <div className="logoutButtonBox">
                <button className="logoutButton" onClick={logoutOnClick}>로그아웃</button>
            </div>
        </>
    );
}

export default AfterLogin