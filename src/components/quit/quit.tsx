import "./style.css";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import API from "../../apis/api";

export default function Quit() {

    const [quitId, setQuitId] = useState("");
    const [quitPwd, setQuitPwd] = useState("");
    const navigate = useNavigate();

    const pressEnterKey = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            // await loginOnClick();
        }
    }

    const quitIdOnChange = (e: any) => {
        setQuitId(e.target.value);
    }

    const quitPwdOnChange = (e: any) => {
        setQuitPwd(e.target.value);
    }

    const quitOnClick = async () => {
        if(window.confirm("정말로 탈퇴 하시겠습니까?")) {
            await quitUser();
        }
    }

    const quitUser = async () => {
        if (quitId === localStorage.getItem("userId")) {
            await API.delete("/user/delete", {
                data: {
                    userId: quitId,
                    userPwd: quitPwd
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }).catch((err) => {
                console.error(err);
            }).then((res) => {
                if(res?.data.code !== "S00") {
                    alert(res?.data.msg);
                } else {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("userNo");
                    localStorage.removeItem("userId");
                    alert("탈퇴하였습니다.");
                    navigate("/");
                }
            })
        } else {
            alert("아이디가 틀립니다.");
        }
    }

    const cancelOnClick = () => {
        console.log("탈퇴 취소 버튼 클릭!");
        navigate("/");
    }

    return (
        <div className="quitScreen">
            <div className="quitBox">
                <div className="quitIdBox">
                    <input type="text" className="quitIdInput" placeholder="아이디를 입력하세요." value={quitId} onChange={quitIdOnChange} autoFocus={true}/>
                </div>
                <div className="quitPwdBox">
                    <input type="password" className="quitPwdInput" placeholder="비밀번호를 입력하세요." onKeyDown={pressEnterKey} value={quitPwd} onChange={quitPwdOnChange}/>
                </div>
                <div className="quitOkButton">
                    <button onClick={quitOnClick}>탈퇴하기</button>
                </div>
                <div className="quitCancelButton">
                    <button onClick={cancelOnClick}>취소</button>
                </div>
            </div>
        </div>
    );
}