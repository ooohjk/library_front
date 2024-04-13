import Pagination from "../pagination/pagination";
import React, { useEffect, useState } from "react";
import API from "../../apis/api";

export default function UserManage() {

    const [userList, setUserList] = useState([{
        userNo: 0,
        userId: "",
        userName: "",
        userEmail: "",
        tel: "",
        gender: "",
        userGrade: "",
        provider: "",
        providerId: "",
    }]);
    const [userIdList, setUserIdList] = useState<string[]>([]);
    const [isChecked, setIsChecked] = useState(false);
    const [page, setPage] = useState(1); // page
    const limit = 10; // 한 페이지당 리스트 갯수
    const offset = (page - 1) * limit; // offset

    const allUserInfo = async () => {
        await API.get(`/user/getAll`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).catch((err) => {
            console.error(err);
        }).then((res) => {
            if (res?.data.code !== "S00") {
                alert(res?.data.msg);
            } else {
                setUserList(res?.data.data);
            }
        });
    }

    useEffect(() => {
        allUserInfo().then();
    }, []);

    const checkBoxOnChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setIsChecked(!isChecked);
        checkBoxHandler(e.target.checked, id);
    }

    const checkBoxHandler = (isChecked: boolean, id: string) => {
        if (isChecked) {
            setUserIdList((prev) => [...prev, id]);
            return
        }
        if (!isChecked && userIdList.includes(id)) {
            setUserIdList(userIdList.filter((list) => list !== id));
        }
    }

    useEffect(() => {
        // console.log("userIdList: ", userIdList);
    }, [userIdList]);

    const UserTable = () => {
        return (
            <>
                {userList.slice(offset, offset + limit).map((list, i) => (
                    <tr className="userList" key={i}>
                        <td>
                            <input type="checkbox" value={list.userId} onChange={(e) => checkBoxOnChange(e, list.userId)} checked={userIdList.includes(list.userId)} disabled={list.userId === "admin"}/>
                        </td>
                        <td>{list.userNo}</td>
                        <td>{list.userId}</td>
                        <td>{list.userName}</td>
                        <td>{list.userEmail}</td>
                        <td>{list.tel}</td>
                        <td>{list.gender}</td>
                        <td>{list.userGrade}</td>
                        <td>{list.provider === "NONE" ? "-" : list.provider}</td>
                        <td>{list.providerId === null ? "-" : list.providerId}</td>
                    </tr>
                ))}
            </>
        );
    }

    const userDeleteButtonOnClick = async () => {
        console.log(userIdList);
        if (userIdList.length > 0) {
            if (window.confirm("정말 해당 유저를 삭제 하시겠습니까?")) {
                await API.delete(`/admin/delete/user`, {
                    data: {
                        userList: userIdList
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
                        alert("해당 유저들을 삭제 하였습니다.");
                        window.location.reload();
                    }
                });
            }
        } else {
            alert("삭제할 유저를 선택하세요.");
        }
    }

    return (
        <>
            <div className="userManage">
                <span>&lt;유저 관리&gt;</span>
                <button className="userDeleteButton" onClick={userDeleteButtonOnClick}>삭제</button>
                <table className="userTable">
                    <thead>
                    <tr>
                        <th>-</th>
                        <th>유저번호</th>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>연락처</th>
                        <th>성별</th>
                        <th>등급</th>
                        <th>플랫폼</th>
                        <th>플랫폼 아이디</th>
                    </tr>
                    </thead>
                    <tbody>
                    <UserTable/>
                    </tbody>
                </table>
                <footer>
                    <Pagination
                        total={userList.length}
                        limit={limit}
                        page={page}
                        setPage={setPage}
                    />
                </footer>
            </div>
        </>
    );
}