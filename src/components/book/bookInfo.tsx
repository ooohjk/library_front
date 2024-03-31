import {useEffect, useState} from "react";
import API from "../../apis/api";
import {useParams} from "react-router-dom";
import Api from "../../apis/api";

export default function BookInfo() {

    const { option, search } = useParams();
    const [bookCode, setBookCode] = useState(0);
    const [bookName, setBookName] = useState("");
    const [bookAuthor, setBookAuthor] = useState("");
    const [bookContent, setBookContent] = useState("");
    const [bookState, setBookState] = useState(0);
    const [bookPublisher, setBookPublisher] = useState("");
    const [isbn, setIsbn] = useState("");
    const [pubDate, setPubDate] = useState("");
    const [bookLocation, setBookLocation] = useState("");
    const [bookImage, setBookImage] = useState("");
    const [height, setHeight] = useState(80);
    const [contentBtn, setContentBtn] = useState(false);
    const [isHeart, setIsHeart] = useState(false);
    const [isRent, setIsRent] = useState(false);
    const [isReturn, setIsReturn] = useState(true);
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

    const contentBtnOnClick = () => {
        if(contentBtn) {
            setHeight(80);
        } else {
            setHeight(800);
        }
        setContentBtn(!contentBtn); // false: 펼치기 버튼, true: 요약 버튼
    }

    useEffect(() => {
        checkMyList().then();
    }, [])

    useEffect(() => {
        bookSearch().then();
    }, []);

    useEffect(() => {
        checkHeartList().then();
    }, [bookCode])

    useEffect(() => {
        if (localStorage.getItem("accessToken") !== null) {
            setIsRent(bookState !== 0);
        } else {
            setIsRent(true);
        }
    }, [bookState]);

    useEffect(() => {
        rentList.map((list, i) => {
            if (list.bookCode === bookCode && bookCode !== 0) {
                setIsReturn(false);
            }
        })
    }, [rentList]);

    const bookSearch = async () => {
        await API.get(`/book/search/detail/${option}/${search}`)
            .catch((err) => {
                console.error(err);
            }).then((res) => {
                setBookCode(res?.data.data.bookCode);
                setBookName(res?.data.data.bookName);
                setBookAuthor(res?.data.data.bookAuthor);
                setBookContent(res?.data.data.bookContent);
                setBookState(res?.data.data.bookState);
                setBookPublisher(res?.data.data.bookPublisher);
                setIsbn(res?.data.data.isbn);
                setPubDate(res?.data.data.pubDate);
                setBookLocation(res?.data.data.bookLocation);
                setBookImage(res?.data.data.bookImage);
            })
    }

    const checkHeartList = async () => {
        if (localStorage.getItem("accessToken") !== null) {
            await API.get(`/user/heart/${localStorage.getItem("userNo")}/${bookCode}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }).catch((err) => {
                console.error(err);
            }).then((res) => {
                if (res?.data.code === "S00") {
                    setIsHeart(true);
                }
            })
        }
    }

    const clickHeart = async () => {
        if (localStorage.getItem("accessToken") !== null) {
            if (!isHeart) {
                await API.post(`/user/heart/reg`, {
                    userNo: localStorage.getItem("userNo"),
                    bookCode: bookCode
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    }
                }).catch((err) => {
                    console.error(err);
                }).then((res) => {
                    // console.log(res?.data);
                    if(res?.data.code !== "S00") {
                        alert(res?.data.msg);
                    } else {
                        setIsHeart(true);
                    }
                })
            }
        } else {
            alert("로그인 이후 이용 가능합니다.");
        }
    }

    const rentButtonOnClick = async () => {
        await API.post(`/rent/history/add/${localStorage.getItem("userNo")}/${bookCode}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).catch((err) => {
            console.error(err);
        }).then((res) => {
            if (res?.data.code !== "S00") {
                alert(res?.data.msg);
            } else {
                setIsRent(true);
                setBookState(1);
                setIsReturn(false);
            }
        })
    }

    const returnButtonOnClick = async () => {
        if (window.confirm("반납 하시겠습니까?")) {
            await API.put(`/rent/history/return/${localStorage.getItem("userNo")}/${bookCode}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }).catch((err) => {
                console.error(err);
            }).then((res) => {
                setIsReturn(true);
                setIsRent(false);
                setBookState(0);
            })
        }
    }

    const checkMyList = async () => {
        if (localStorage.getItem("accessToken") !== null) {
            await API.get(`/rent/history/mylist/current/${localStorage.getItem("userNo")}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }).catch((err) => {
                console.error(err);
            }).then((res) => {
                setRentList(res?.data.data);
            });
        }
    }

    return (
        <>
            <div className="bookImageBox">
                <img src={bookImage} alt=""/>
            </div>
            <div className="bookInfoBox">
                <div className="bookInfo">
                    <div className="clickHeart" onClick={clickHeart}>
                        {isHeart && (
                            <img className="heartImg" src="/heart2.png" alt=""/>
                        )}
                        {!isHeart && (
                            <img className="heartImg" src="/heart.png" alt=""/>
                        )}
                    </div>
                    <p className="bookTitle">제목: {bookName}</p>
                    <hr/>
                    <p className="bookAuthor">저자: {bookAuthor}</p>
                    <p className="isbn">ISBN: {isbn}</p>
                    <p className="bookPublisher">출판사: {bookPublisher}</p>
                    <p className="pubDate">발행일: {pubDate.substring(0, 4)} / {pubDate.substring(4, 6)} / {pubDate.substring(6)}</p>
                    <p className="bookLocation">위치: {bookLocation}</p>
                    <p className="bookState">
                        상태: {bookState ? "대여중" : "대여가능"}
                        <span className="rentButtonBox">
                            <button className="rentBtn" onClick={rentButtonOnClick} disabled={isRent}>대여</button>
                            <button className="returnBtn" onClick={returnButtonOnClick} disabled={isReturn}>반납</button>
                        </span>
                    </p>
                </div>
            </div>
            <hr/>
            <div className="bookContentBox">
                <div className="bookContent" style={{height: height}}>
                    {bookContent}
                </div>
                <button onClick={contentBtnOnClick} className="contentBtn">{contentBtn ? "요약" : "펼치기"}</button>
            </div>
        </>
    );
}