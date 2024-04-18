import "./style.css";
import { useEffect, useState } from "react";
import API from "../../../apis/api";
import Pagination from "../../pagination/pagination";
import {useNavigate} from "react-router-dom";

export default function History() {

    const [rentList, setRentList] = useState([{
        bookCode: 0,
        bookName: "",
        extension: false,
        prospectDt: "",
        rentDt: "",
        rentNo: 0,
        rentState: 0,
        returnDt: "",
        userNo: 0
    }]);
    const [page, setPage] = useState(1); // page
    const limit = 10; // 한 페이지당 리스트 갯수
    const offset = (page - 1) * limit; // offset
    const navigate = useNavigate();

    const allRentHistory = async () => {
        await API.get(`/rent/history/mylist/all/${localStorage.getItem("userNo")}`, {
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

    useEffect(() => {
        allRentHistory().then();
    }, []);

    const nameOnClick = (e: any) => {
        // 로그인 상세 조회
        navigate(`/search/detail/bookName/${e.target.innerText}`);
    }

    const AllRentHistory = () => {
        return (
            <>
                {rentList.slice(offset, offset + limit).map((list, idx) => (
                    <tr key={idx}>
                        <td>{idx + offset + 1}</td>
                        <td onClick={nameOnClick} className="bookName">{list.bookName}</td>
                        <td>{list.rentDt.substring(0, 4)}/{list.rentDt.substring(4, 6)}/{list.rentDt.substring(6)}</td>
                        {list.returnDt !== null && (
                            <td>{list.returnDt.substring(0, 4)}/{list.returnDt.substring(4, 6)}/{list.returnDt.substring(6)}</td>
                        )}
                        {list.returnDt === null && (
                            <td>-</td>
                        )}
                        <td>{list.rentState === 0 ? "대여중" : "반납"}</td>
                    </tr>
                ))}
            </>
        );
    }

    return (
        <>
            <div>
                <table className="rentHistoryTable">
                    <thead>
                    <tr>
                        <th>번호</th>
                        <th>도서 제목</th>
                        <th>대여 날짜</th>
                        <th>반납 날짜</th>
                        <th>상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rentList.length > 0 && (
                        <AllRentHistory/>
                    )}
                    {rentList.length === 0 && (
                        <tr>
                            <td colSpan={5}>대여 기록이 없습니다.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <footer>
                    <Pagination
                        total={rentList.length} // 전체 리스트 갯수
                        limit={limit}           // 한 페이지당 리스트 갯수
                        page={page}             // 페이지
                        setPage={setPage}       // 페이지 변동 함수
                    />
                </footer>
            </div>
        </>
    );
}