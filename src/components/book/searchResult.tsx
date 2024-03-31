import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import API from "../../apis/api";
import AfterLogin from "../main/afterLogin";
import Pagination from "../pagination/pagination";
import Search from "../main/search";
import BeforeLogin from "../main/beforeLogin";

export default function SearchResult() {
    const { option, search } = useParams();
    const navigate = useNavigate();
    const [bookList, setBookList] = useState([{
        bookCode: 0,
        bookName: "",
        bookAuthor: "",
        bookContent: "",
        bookState: 0,
        bookPublisher: "",
        isbn: "",
        pubDate: "",
        bookLocation: "",
        bookImage: "",
        review: []
    }]);
    const [page, setPage] = useState(1); // page
    const limit = 10; // 한 페이지당 리스트 갯수
    const offset = (page - 1) * limit; // offset

    useEffect(() => {
        bookSearchList().then();
    }, [option, search]);

    const bookSearchList = async () => {
        await API.get(`/book/search/${option}/${search}`)
            .catch((err) => {
                console.error(err);
            }).then((res) => {
                setBookList(res?.data.data);
            })
    }

    let headers;
    if(localStorage.getItem("accessToken") === null) {
        headers = <BeforeLogin/>
    } else {
        headers = <AfterLogin/>
    }

    const nameOnClick = (e: any) => {
        if(localStorage.getItem("accessToken") === null) {
            // 비로그인 간단 조회
            navigate(`/search/simple/bookName/${e.target.innerText}`);
        } else {
            // 로그인 상세 조회
            navigate(`/search/detail/bookName/${e.target.innerText}`);
        }
    }

    const BookSearch = () => {
        return (
            <>
                {bookList.slice(offset, offset + limit).map(
                    (list, idx) => (
                        <tr key={idx}>
                            <td>{list.bookCode}</td>
                            <td onClick={nameOnClick} className="bookName">{list.bookName}</td>
                            <td>{list.bookAuthor}</td>
                            <td>{list.pubDate}</td>
                            <td>{list.bookState}</td>
                            <td>
                                <img src={list.bookImage} alt="" style={{ width: 70, height: 100 }}/>
                            </td>
                        </tr>
                    )
                )}
            </>
        );
    }

    return (
        <>
            <div className="searchScreen">
                <div className="searchHeader">
                    {headers}
                </div>
                <div className="searchBody">
                    <div className="searchContent">
                        <table className="searchListTable">
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>저자</th>
                                <th>발행연도</th>
                                <th>상태</th>
                                <th>이미지</th>
                            </tr>
                            </thead>
                            <tbody>
                            {bookList.length > 0 && (
                                <BookSearch/>
                            )}
                            </tbody>
                        </table>
                        <footer>
                            <Pagination
                                total={bookList.length}     // 전체 리스트 갯수
                                limit={limit}               // 한 페이지당 리스트 갯수
                                page={page}                 // 페이지
                                setPage={setPage}           // 페이지 변동 함수
                            />
                        </footer>
                        <Search/>
                    </div>
                </div>
            </div>
        </>
    );
}