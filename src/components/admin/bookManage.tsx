import React, { useEffect, useState } from "react";
import API from "../../apis/api";
import Pagination from "../pagination/pagination";
import Modal from "react-modal";

export default function BookManage() {

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
        bookImage: ""
    }]);
    const [bookCodeList, setBookCodeList] = useState<number[]>([]);
    const [isChecked, setIsChecked] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 5;
    const offset = (page - 1) * limit;
    const [isPlus, setIsPlus] = useState(false);
    const [addIsOpen, setAddIsOpen] = useState(false);
    const [updateIsOpen, setUpdateIsOpen] = useState(false);
    const modalTitleList = ["-", "책번호", "제목", "저자", "내용", "상태", "출판사", "ISBN", "발행날짜", "위치", "이미지"];
    const [modalTitle, setModalTitle] = useState("");
    const [addBookTitle, setAddBookTitle] = useState("");
    const [addBookAuthor, setAddBookAuthor] = useState("");
    const [addBookContent, setAddBookContent] = useState("");
    const [addBookState, setAddBookState] = useState(-1);
    const [addBookPublisher, setAddBookPublisher] = useState("");
    const [addBookIsbn, setAddBookIsbn] = useState("");
    const [addBookPubDate, setAddBookPubDate] = useState("");
    const [addBookLocation, setAddBookLocation] = useState("");
    const [addBookImage, setAddBookImage] = useState("");
    const [fullContentIsOpen, setFullContentIsOpen] = useState(false);
    const [fullContent, setFullContent] = useState("");
    const allBookInfo = async () => {
        await API.get(`/book/getAll`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).catch((err) => {
            console.error(err);
        }).then((res) => {
            if (res?.data.code !== "S00") {
                alert(res?.data.msg);
            } else {
                setBookList(res?.data.data);
            }
        })
    }

    useEffect(() => {
        allBookInfo().then();
    }, []);

    const fullContentOnClick = (content: string) => {
        setFullContent(content);
        setFullContentIsOpen(true);
        document.body.style.overflow = "hidden";
    }

    const BookTable = () => {
        return (
            <>
                {fullContentIsOpen && (
                    <Modal isOpen={fullContentIsOpen} ariaHideApp={false} onRequestClose={() => {
                        setFullContentIsOpen(false);
                        document.body.style.overflow = "unset";
                    }}>
                        {fullContent}
                    </Modal>
                )}
                {bookList.slice(offset, offset + limit).map((list, i) => (
                    <tr className="bookList" key={i}>
                        <td>
                            <input type="checkbox" value={list.bookCode} onChange={(e) => checkBoxOnChange(e, list.bookCode)} checked={bookCodeList.includes(list.bookCode)}/>
                        </td>
                        <td>{list.bookCode}</td>
                        <td>{list.bookName}</td>
                        <td>{list.bookAuthor}</td>
                        <td className="fullContent" onClick={() => fullContentOnClick(list.bookContent)}>...</td>
                        <td>{list.bookState ? "대여중" : "대여가능"}</td>
                        <td>{list.bookPublisher}</td>
                        <td>{list.isbn}</td>
                        <td>{list.pubDate}</td>
                        <td>{list.bookLocation}</td>
                        <td>
                            <img src={list.bookImage} alt=""/>
                        </td>
                    </tr>
                ))}
            </>
        );
    }

    const checkBoxOnChange = (e: React.ChangeEvent<HTMLInputElement>, code: number) => {
        setIsChecked(!isChecked);
        checkBoxHandler(e.target.checked, code);
    }

    const checkBoxHandler = (isChecked: boolean, code: number) => {
        if (isChecked) {
            setBookCodeList((prev) => [...prev, code]);
            return
        }
        if (!isChecked && bookCodeList.includes(code)) {
            setBookCodeList(bookCodeList.filter((list) => list !== code));
        }
    }

    const bookDeleteButtonOnClick = async () => {
        if (bookCodeList.length > 0) {
            if (window.confirm("정말 해당 도서를 삭제 하시겠습니까?")) {
                await API.delete(`/book/delete`, {
                    data: {
                        bookList: bookCodeList
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
                        alert("해당 도서들을 삭제 하였습니다.");
                        window.location.reload();
                    }
                });
            }
        } else {
            alert("삭제할 도서를 선택하세요.");
        }
    }

    const plusButtonOnclick = () => {
        setIsPlus(!isPlus);
    }

    const AddBookList = () => {

        const [modalContent, setModalContent] = useState("");

        const addBookInfoOnClick = (e: any) => {
            setModalTitle(modalTitleList[e.target.closest("td").cellIndex]);
            setAddIsOpen(true);
            document.body.style.overflow = "hidden";
        }

        const contentOnChange = (e : any) => {
            setModalContent(e.target.value);
        }

        const okClick = () => {
            if(modalContent !== "") {
                switch (modalTitleList.indexOf(modalTitle)) {
                    case 2: setAddBookTitle(modalContent); break;
                    case 3: setAddBookAuthor(modalContent); break;
                    case 4: setAddBookContent(modalContent); break;
                    case 5: setAddBookState(Number(modalContent)); break;
                    case 6: setAddBookPublisher(modalContent); break;
                    case 7: setAddBookIsbn(modalContent); break;
                    case 8: setAddBookPubDate(modalContent); break;
                    case 9: setAddBookLocation(modalContent); break;
                    case 10: setAddBookImage(modalContent); break;
                }
            }
            setAddIsOpen(false);
            document.body.style.overflow = "unset";
        }

        return (
            <>
                {addIsOpen && (
                    <Modal isOpen={addIsOpen} onRequestClose={() => {
                        setAddIsOpen(false);
                        document.body.style.overflow = "unset";
                    }} ariaHideApp={false} className="addBookModal">
                        <div className="modalTitle">
                            {modalTitle}
                        </div>
                        <div className="modalBody">
                            <textarea className="addBookInfoContent" onChange={contentOnChange} autoFocus={true}></textarea>
                            <div>
                                <button className="modalOk" onClick={okClick}>확인</button>
                                <button className="modalCancel" onClick={() => {
                                    setAddIsOpen(false);
                                    document.body.style.overflow = "unset";
                                }}>취소</button>
                            </div>
                        </div>
                    </Modal>
                )}
                {isPlus && (
                    <tr className="plusBook">
                        <td>-</td>
                        <td>-</td>
                        <td className="addBookInfo" onClick={addBookInfoOnClick}>{addBookTitle}</td>
                        <td className="addBookInfo" onClick={addBookInfoOnClick}>{addBookAuthor}</td>
                        <td className="addBookInfo" onClick={addBookInfoOnClick}>{addBookContent.length > 0 ? "..." : ""}</td>
                        <td className="addBookInfo" onClick={addBookInfoOnClick}>{addBookState === -1 ? null : addBookState}</td>
                        <td className="addBookInfo" onClick={addBookInfoOnClick}>{addBookPublisher}</td>
                        <td className="addBookInfo" onClick={addBookInfoOnClick}>{addBookIsbn}</td>
                        <td className="addBookInfo" onClick={addBookInfoOnClick}>{addBookPubDate}</td>
                        <td className="addBookInfo" onClick={addBookInfoOnClick}>{addBookLocation}</td>
                        <td className="addBookInfo" onClick={addBookInfoOnClick}>{addBookImage}</td>
                    </tr>
                )}
            </>
        );
    }

    const bookAddButtonOnClick = async () => {
        if ((addBookTitle.length && addBookAuthor.length && addBookContent.length && addBookPublisher.length && addBookIsbn.length && addBookPubDate.length && addBookLocation.length) > 0 && addBookState !== -1) {
            if (window.confirm("입력한 도서정보를 추가 하시겠습니까?")) {
                await API.post(`/book/add`, {
                    bookName: addBookTitle,
                    bookAuthor: addBookAuthor,
                    bookContent: addBookContent,
                    bookState: addBookState,
                    bookPublisher: addBookPublisher,
                    isbn: addBookIsbn,
                    pubDate: addBookPubDate,
                    bookLocation: addBookLocation,
                    bookImage: addBookImage === "" ? "/no_image.png" : addBookImage
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    }
                }).catch((err) => {
                    console.error(err);
                }).then((res) => {
                    if (res?.data.code !== "S00") {
                        alert(res?.data.msg);
                    } else {
                        window.location.reload();
                        setAddBookTitle("");
                        setAddBookAuthor("");
                        setAddBookContent("");
                        setAddBookState(-1);
                        setAddBookPublisher("");
                        setAddBookIsbn("");
                        setAddBookPubDate("");
                        setAddBookLocation("");
                        setAddBookImage("");
                    }
                })
            }
        } else {
            alert("추가할 도서 정보를 입력하세요.");
        }
    }

    const bookUpdateOnClick = () => {
        if (bookCodeList.length === 0) {
            alert("수정할 책을 선택하세요.");
        } else if (bookCodeList.length > 1) {
            alert("한개씩 선택하세요.");
        } else {
            setUpdateIsOpen(true);
            document.body.style.overflow = "hidden";
        }
    }

    const UpdateModal = () => {

        const [updateBookName, setUpdateBookName] = useState("");
        const [updateBookAuthor, setUpdateBookAuthor] = useState("");
        const [updateBookContent, setUpdateBookContent] = useState("");
        const [updateBookState, setUpdateBookState] = useState(0);
        const [updateBookPublisher, setUpdateBookPublisher] = useState("");
        const [updateBookIsbn, setUpdateBookIsbn] = useState("");
        const [updateBookPubDate, setUpdateBookPubDate] = useState("");
        const [updateBookLocation, setUpdateBookLocation] = useState("");
        const [updateBookImage, setUpdateBookImage] = useState("");

        const bookNameHandler = (e: any) => {
            setUpdateBookName(e.target.value);
        }

        const bookAuthorHandler = (e: any) => {
            setUpdateBookAuthor(e.target.value);
        }

        const bookContentHandler = (e: any) => {
            setUpdateBookContent(e.target.value);
        }

        const bookStateHandler = (e: any) => {
            setUpdateBookState(e.target.value);
        }

        const bookPublisherHandler = (e: any) => {
            setUpdateBookPublisher(e.target.value);
        }

        const bookIsbnHandler = (e: any) => {
            setUpdateBookIsbn(e.target.value);
        }

        const bookPubDateHandler = (e: any) => {
            setUpdateBookPubDate(e.target.value);
        }

        const bookLocationHandler = (e: any) => {
            setUpdateBookLocation(e.target.value);
        }

        const bookImageHandler = (e: any) => {
            setUpdateBookImage(e.target.value);
        }

        const updateBookModalUpBtnOnClick = async () => {
            if (window.confirm("정말 수정하시겠습니까?")) {
                if ((updateBookName.length && updateBookAuthor.length && updateBookContent.length && updateBookPublisher.length && updateBookIsbn.length && updateBookPubDate.length && updateBookLocation.length) > 0) {
                    await API.put(`/book/update/${bookCodeList[0]}`, {
                        bookName: updateBookName,
                        bookAuthor: updateBookAuthor,
                        bookContent: updateBookContent,
                        bookState: updateBookState,
                        bookPublisher: updateBookPublisher,
                        isbn: updateBookIsbn,
                        pubDate: updateBookPubDate,
                        bookLocation: updateBookLocation,
                        bookImage: updateBookImage === "" ? "/no_image.png" : updateBookImage
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                        }
                    }).catch((err) => {
                        console.error(err);
                    }).then((res) => {
                        if (res?.data.code !== "S00") {
                            alert(res?.data.msg);
                        } else {
                            alert("수정되었습니다.");
                            setUpdateIsOpen(false);
                            document.body.style.overflow = "unset";
                            window.location.reload();
                        }
                    });
                } else {
                    alert("필수 입력사항들이 있습니다.");
                }
            }
        }

        const updateBookModalCaBtnOnClick = () => {
            setUpdateIsOpen(false);
            document.body.style.overflow = "unset";
        }

        return (
            <>
                <Modal isOpen={updateIsOpen} onRequestClose={() => {
                    setUpdateIsOpen(false);
                    document.body.style.overflow = "unset";
                }} ariaHideApp={false}>
                    <div className="updateBookModalBox">
                        <div className="updateBookModal">
                            <div className="updateBook">
                                <span>책제목</span>
                                <input type="text" className="updateBookTextBox" onChange={bookNameHandler} placeholder="필수 입력사항 입니다."/>
                            </div>
                            <div className="updateBook">
                                <span>저자</span>
                                <input type="text" className="updateBookTextBox" onChange={bookAuthorHandler} placeholder="필수 입력사항 입니다."/>
                            </div>
                            <div className="updateBook">
                                <span>내용</span>
                                <input type="text" className="updateBookTextBox" onChange={bookContentHandler} placeholder="필수 입력사항 입니다."/>
                            </div>
                            <div className="updateBook">
                                <span>상태</span>
                                <select className="updateBookTextBox" onChange={bookStateHandler}>
                                    <option value={0}>0</option>
                                    <option value={1}>1</option>
                                </select>
                            </div>
                            <div className="updateBook">
                                <span>출판사</span>
                                <input type="text" className="updateBookTextBox" onChange={bookPublisherHandler} placeholder="필수 입력사항 입니다."/>
                            </div>
                            <div className="updateBook">
                                <span>ISBN</span>
                                <input type="text" className="updateBookTextBox" onChange={bookIsbnHandler} placeholder="필수 입력사항 입니다."/>
                            </div>
                            <div className="updateBook">
                                <span>발행날짜</span>
                                <input type="text" className="updateBookTextBox" onChange={bookPubDateHandler} placeholder="필수 입력사항 입니다."/>
                            </div>
                            <div className="updateBook">
                                <span>위치</span>
                                <input type="text" className="updateBookTextBox" onChange={bookLocationHandler} placeholder="필수 입력사항 입니다."/>
                            </div>
                            <div className="updateBook">
                                <span>이미지</span>
                                <input type="text" className="updateBookTextBox" onChange={bookImageHandler}/>
                            </div>
                        </div>
                    </div>
                    <div className="updateBookModalBtn">
                        <button className="updateBookModalUpBtn" onClick={updateBookModalUpBtnOnClick}>수정</button>
                        <button className="updateBookModalCaBtn" onClick={updateBookModalCaBtnOnClick}>취소</button>
                    </div>
                </Modal>
            </>
        );
    }

    return (
        <>
            <div className="bookManage">
                <span>&lt;책 관리&gt;</span>
                <button className="addBookButton" onClick={bookAddButtonOnClick}>추가</button>
                <button className="updateBookButton" onClick={bookUpdateOnClick}>수정</button>
                <button className="deleteBookButton" onClick={bookDeleteButtonOnClick}>삭제</button>
                <table className="bookTable">
                    <thead>
                    <tr>
                        <th style={{ width: 20 }}>-</th>
                        <th style={{ width: 70 }}>책번호</th>
                        <th style={{ width: 100 }}>제목</th>
                        <th style={{ width: 60 }}>저자</th>
                        <th style={{ width: 50 }}>내용</th>
                        <th style={{ width: 90 }}>상태</th>
                        <th style={{ width: 80 }}>출판사</th>
                        <th style={{ width: 140 }}>ISBN</th>
                        <th style={{ width: 120 }}>발행날짜</th>
                        <th style={{ width: 20 }}>위치</th>
                        <th style={{ width: 150 }}>이미지</th>
                    </tr>
                    </thead>
                    <tbody>
                    <BookTable/>
                    <AddBookList/>
                    <UpdateModal/>
                    <tr>
                        <td colSpan={11} className="plusButton" onClick={plusButtonOnclick}>+</td>
                    </tr>
                    </tbody>
                </table>
                <footer>
                    <Pagination
                        total={bookList.length}
                        limit={limit}
                        page={page}
                        setPage={setPage}
                    />
                </footer>
            </div>
        </>
    );
}