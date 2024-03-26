import "./style.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import API from "../../apis/api";

export default function Login() {

    const navigate = useNavigate();
    const [id, setId] = useState("");
    const [pwd, setPwd] = useState("");

    const loginCheck = async () => {
        await API.post("/user/login", {
            userId: id, userPwd: pwd
        }).catch((err) => {
            console.error("Error: ", err);
        }).then((res) => {
            if (res?.data.code !== "S00") {
                alert(res?.data.msg);
            } else {
                const token = res?.data.data["accessToken"];
                localStorage.setItem("accessToken", token);
                localStorage.setItem("userNo", res?.data.data["userNo"]);
                localStorage.setItem("userId", res?.data.data["userId"]);
                navigate("/");
            }
        });
    }

    const loginOnClick = async () => {
        await loginCheck();
    }

    const cancelOnClick = () => {
        console.log("로그인 취소 버튼 클릭!");
        navigate("/");
    }

    const pressEnterKey = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            await loginOnClick();
        }
    }

    const idOnChange = (e: any) => {
        setId(e.target.value);
    }

    const pwdOnChange = (e: any) => {
        setPwd(e.target.value);
    }

    return (
        <div className="loginScreen">
            <div className="loginBox">
                <div className="idBox">
                    <input type="text" className="idInput" placeholder="아이디를 입력하세요." value={id} onChange={idOnChange} autoFocus={true}/>
                </div>
                <div className="pwdBox">
                    <input type="password" className="pwdInput" placeholder="비밀번호를 입력하세요." onKeyDown={pressEnterKey} value={pwd} onChange={pwdOnChange}/>
                </div>
                <div className="okButton">
                    <button onClick={loginOnClick}>로그인</button>
                </div>
                <div className="cancelButton">
                    <button onClick={cancelOnClick}>취소</button>
                </div>
            </div>
        </div>
    );
}