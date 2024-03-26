import "./style.css";
import { useEffect, useState } from "react";
import API from "../../../apis/api";

export default function State() {

    const [rentList, setRentList] = useState([{
        bookCode: 0,
        bookName: "",
        extension: false,
        prospectDt: "",
        rentDt: "",
        rentNo: 0,
        rentState: 0,
        returnDt: null,
        userNo: 0
    }]);

    const extensionOnClick = async (e: any) => {
        if(window.confirm("연장 하시겠습니까?")) {
            await extensionConfirm(e);
        }
    }

    //연장
    const extensionConfirm = async (e: any) => {
        await API.put(`/rent/history/extension/${localStorage.getItem("userNo")}/${e.target.value}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        })
            .catch((err) => {
                console.error(err);
            }).then((res) => {
                console.log(res?.data);
                if(res?.data.code === "S00") {
                    window.location.reload();
                    console.log("연장 성공");
                } else {
                    alert(res?.data.msg);
                }
            });
    }

    const returnOnClick = async (e: any) => {
        if(window.confirm("반납하시겠습니까?")) {
            await returnConfirm(e);
        }
    }

    //반납
    const returnConfirm = async (e: any) => {
        await API.put(`/rent/history/return/${localStorage.getItem("userNo")}/${e.target.value}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).catch((err) => {
            console.error(err);
        }).then((res) => {
            console.log(res?.data);
            if(res?.data.code === "S00") {
                window.location.reload();
                console.log("반납 성공");
            } else {
                alert(res?.data.msg);
            }
        })
    }

    function AddRentHistory() {
        return (
            <>
                {rentList.map((list, idx) => (
                    <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{list.bookName}</td>
                        <td>{list.rentDt}</td>
                        <td>{list.prospectDt}</td>
                        <td>
                            <button className="extensionButton" onClick={extensionOnClick} value={list.bookCode}>연장</button>
                        </td>
                        <td>
                            <button className="returnButton" onClick={returnOnClick} value={list.bookCode}>반납</button>
                        </td>
                    </tr>
                ))}
            </>
        );
    }

    useEffect(() => {
        currentRentState().then();
    }, []);

    //현제 대여 목록
    const currentRentState = async () => {
        await API.get(`/rent/history/mylist/current/${localStorage.getItem("userNo")}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).catch((err) => {
            console.error(err);
        }).then((res) => {
            if (res?.data.data !== null) {
                setRentList(res?.data.data);
            }
        });
    }

    return (
        <>
            <div>
                <table className="rentStateTable">
                    <thead>
                    <tr>
                        <th>번호</th>
                        <th>도서 제목</th>
                        <th>대여 날짜</th>
                        <th>반납 예정일</th>
                        <th>반납 연장</th>
                        <th>반납 하기</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rentList.length > 0 && (
                        <AddRentHistory/>
                    )}
                    {rentList.length === 0 && (
                        <tr>
                            <td colSpan={6}>대여한 도서가 없습니다.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </>
    );
}