import "./style.css";
import React, { useState } from "react";
import API from "../../apis/api";
import { useNavigate } from "react-router-dom";

export default function Join() {

    const [id, setId] = useState("");
    const [pwd, setPwd] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
    const [whatGender, setWhatGender] = useState("남자");
    const navigate = useNavigate();

    const genderHandler = (e : any) => {
        const gender = e.target.value;
        setWhatGender(gender);
    }

    const idOnChange = (e: any) => {
        setId(e.target.value);
    }

    const pwdOnChange = (e: any) => {
        setPwd(e.target.value);
    }

    const nameOnChange = (e: any) => {
        setName(e.target.value);
    }

    const emailOnChange = (e: any) => {
        setEmail(e.target.value);
    }

    const telOnChange = (e: any) => {
        setTel(e.target.value);
    }

    const join = async () => {
        await API.post("/user/join", {
            userId: id,
            userPwd: pwd,
            userName: name,
            tel: tel,
            email: email,
            gender: whatGender === "남자" ? "M" : "F"
        }).catch((err) => {
            console.error(err);
        }).then((res) => {
            console.log(res?.data);
            if(res?.data.code !== "S00") {
                alert(res?.data.msg);
            } else {
                alert("회원가입에 성공하였습니다. 로그인을 해주세요.");
                navigate("/");
            }
        })
    }

    return (
        <div className="joinScreen">
            <div className="joinBox">
                <div className="joinId">
                    <div className="joinIdBox">
                        <span>아이디: </span><input value={id} onChange={idOnChange} autoFocus={true} placeholder="필수 입력사항입니다."/>
                    </div>
                </div>
                <div className="joinPwd">
                    <div className="joinPwdBox">
                        <span>비밀번호: </span><input type="password" value={pwd} onChange={pwdOnChange} placeholder="필수 입력사항입니다."/>
                    </div>
                </div>
                <div className="joinName">
                    <div className="joinNameBox">
                        <span>이름: </span><input value={name} onChange={nameOnChange} placeholder="필수 입력사항입니다."/>
                    </div>
                </div>
                <div className="joinEmail">
                    <div className="joinEmailBox">
                        <span>이메일: </span><input value={email} onChange={emailOnChange} placeholder="필수 입력사항입니다."/>
                    </div>
                </div>
                <div className="joinTel">
                    <div className="joinTelBox">
                        <span>전화번호: </span><input value={tel} onChange={telOnChange} placeholder="010-****-****"/>
                    </div>
                </div>
                <div className="joinGender">
                    <div className="genderBox">
                        <span>성별: </span>
                        <input type="radio" value="남자" className="manButton" id="manButton" checked={whatGender === "남자"} onChange={genderHandler}/><label className="manLabel" htmlFor="manButton">남자</label>
                        <input type="radio" value="여자" className="womanButton" id="womanButton" checked={whatGender === "여자"} onChange={genderHandler}/><label className="womanLabel" htmlFor="womanButton">여자</label>
                    </div>
                </div>
                <div className="joinOk">
                    <button onClick={join}>회원가입</button>
                </div>
                <div className="joinCancel">
                    <button onClick={() => {
                        navigate("/")
                    }}>취소</button>
                </div>
            </div>
        </div>
    );
}