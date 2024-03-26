import "./style.css";
import {useEffect, useState} from "react";
import Pagination from "../../pagination/pagination";
import API from "../../../apis/api";

export default function Hearts() {

    const [hearts, setHearts] = useState([{
        heartNo: 0,
        bookCode: 0,
        bookName: "",
        bookAuthor: "",
        bookPublisher: "",
        bookImage: "",
        regDt: "",
        regTm: ""
    }]);
    const [page, setPage] = useState(1); // page
    const limit = 10; // 한 페이지당 리스트 갯수
    const offset = (page - 1) * limit; // offset

    const getMyHeartsList = async () => {
        await API.get(`/user/hearts/${localStorage.getItem("userNo")}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).catch((err) => {
            console.error(err);
        }).then((res) => {
            if(res?.data.code === "S00") {
                setHearts(res?.data.data.heartList);
            } else {
                alert(res?.data.msg);
            }
        });
    }

    useEffect(() => {
        getMyHeartsList().then();
    }, []);

    const deleteOnClick = async (e: any) => {
        if(window.confirm("찜 해제 하시겠습니까?")) {
            await deleteConfirm(e);
        }
    }

    const deleteConfirm = async (e: any) => {
        await API.delete("/user/heart/remove", {
            data: {
                userNo: localStorage.getItem("userNo"),
                heartNo: e.target.value
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).catch((err) => {
            console.error(err);
        }).then((res) => {
            console.log(res?.data);
            if(res?.data.code === "S00") {
                console.log("찜 해제 성공");
                window.location.reload();
            } else {
                alert(res?.data.msg);
            }
        });
    }

    const HeartsList = () => {
        return (
            <>
                {hearts.slice(offset, offset + limit).map(
                    (heart, idx) => (
                        <tr key={idx}>
                            <td>{heart.bookCode}</td>
                            <td>{heart.bookName}</td>
                            <td>{heart.bookAuthor}</td>
                            <td>{heart.bookPublisher}</td>
                            <td>{heart.bookImage}</td>
                            <td>{heart.regDt.substring(0, 4)}/{heart.regDt.substring(4, 6)}/{heart.regDt.substring(6)} {heart.regTm.substring(0, 2)}:{heart.regTm.substring(2, 4)}:{heart.regTm.substring(4)}</td>
                            <td>
                                <button className="heartDeleteButton" onClick={deleteOnClick} value={heart.heartNo}>해제</button>
                            </td>
                        </tr>
                    )
                )}
            </>
        );
    }

    return (
        <>
            <div>
                <table className="heartsListTable">
                    <thead>
                    <tr>
                        <th>도서 번호</th>
                        <th>도서 제목</th>
                        <th>저자</th>
                        <th>출판사</th>
                        <th>이미지</th>
                        <th>찜 등록 시간</th>
                        <th>찜 해제</th>
                    </tr>
                    </thead>
                    <tbody>
                    {hearts.length > 0 && (
                        <HeartsList/>
                    )}
                    {hearts.length === 0 && (
                        <tr>
                            <td colSpan={7}>찜 목록이 없습니다.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <footer>
                    <Pagination
                        total={hearts.length}   // 전체 리스트 갯수
                        limit={limit}           // 한 페이지당 리스트 갯수
                        page={page}             // 페이지
                        setPage={setPage}       // 페이지 변동 함수
                    />
                </footer>
            </div>
        </>
    );
}