import React, { useState } from "react";
import API from "../../apis/api";
import { useNavigate } from "react-router-dom";

export default function Search() {

    const [book, setBook] = useState("");
    const [selectList, setSelectList] = useState("bookName");
    const navigate = useNavigate();

    const searchOnClick = async () => {
        if (book === "") {
            alert("책 제목 또는 저자로 검색 가능합니다.");
        } else {
            await API.get(`/book/search/${selectList}/${book}`)
                .catch((err) => {
                    console.error(err);
                }).then((res) => {
                    if(res?.data.code !== "S00") {
                        alert(res?.data.msg);
                    } else {
                        navigate(`/search/${selectList}/${book}`);
                    }
                })
        }
    }

    const searchOnChange = (e: any) => {
        setBook(e.target.value);
    }

    const selectOnChange = (e: any) => {
        setSelectList(e.target.value);
    }

    return (
        <>
            <div className="searchBox">
                도서 검색: <input type="text" className="searchText" onChange={searchOnChange}/>
                <select className="selectBox" onChange={selectOnChange}>
                    <option value="bookName">제목</option>
                    <option value="bookAuthor">저자</option>
                </select>
                <button className="searchButton" onClick={searchOnClick}>검색</button>
            </div>
        </>
    );
}