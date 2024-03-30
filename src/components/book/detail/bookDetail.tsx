import "./style.css";
import AfterLogin from "../../main/afterLogin";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../../apis/api";
import LoremIpsum from "react-lorem-ipsum";
import Modal from "react-modal";

export default function BookDetail() {

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
    const [reviews, setReviews] = useState([{
        reviewNo: 0,
        bookCode: 0,
        userId: "",
        regDt: "",
        regTm: "",
        modDt: "",
        modTm: "",
        reviewContent: ""
    }]);
    const [contentBtn, setContentBtn] = useState(false);
    const [height, setHeight] = useState(80);
    const [reviewContent, setReviewContent] = useState("");
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [xy, setXY] = useState({x: 0, y: 0});
    const [update, setUpdate] = useState(false);
    const [updateUserId, stUpdateUserId] = useState("");
    const [updateReviewNo, setUpdateReviewNo] = useState(0);

    useEffect(() => {
        bookDetailSearch().then();
    }, []);

    const bookDetailSearch = async () => {
        await API.get(`/book/search/detail/${option}/${search}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        })
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
                setReviews(res?.data.data.review);
            })
    }

    const contentBtnOnClick = () => {
        if(contentBtn) {
            setHeight(80);
        } else {
            setHeight(800);
        }
        setContentBtn(!contentBtn); // false: 펼치기 버튼, true: 요약 버튼
    }

    const contentOnClick = (reviewNo: number, userId: string, e: any) => {
        if (userId !== localStorage.getItem("userId")) {
            alert("본인 게시글만 수정가능합니다.");
        } else {
            stUpdateUserId(userId);
            setUpdateReviewNo(reviewNo);
            setIsModalOpened(true);
            document.body.style.overflow = "hidden";
            setXY({x: e.clientX, y: e.clientY});
        }
    }

    const BookReviews = () => {
        return (
            <>
                {reviews.map((r, idx) => (
                    <tr key={idx}>
                        <td className="reviewId">{r.userId}</td>
                        <td className="reviewContent" onClick={(e) => contentOnClick(r.reviewNo, r.userId, e)}>{r.reviewContent}</td>
                        {(r.modDt === null || ((r.modDt === r.regDt) && (r.modTm === r.regTm))) && (
                        <td className="reviewDate" id={"beforeMod"}>     {/*수정전*/}
                            {r.regDt.substring(0, 4)} / {r.regDt.substring(4, 6)} / {r.regDt.substring(6)}<br/>{r.regTm.substring(0, 2)} : {r.regTm.substring(2, 4)} : {r.regTm.substring(4)}
                        </td>
                        )}
                        {(r.modDt !== null && ((r.modDt !== r.regDt) || (r.regTm !== r.modTm))) && (
                        <td className="reviewDate" id={"afterMod"}>      {/*수정후*/}
                            {r.modDt.substring(0, 4)} / {r.modDt.substring(4, 6)} / {r.modDt.substring(6)}<br/>{r.modTm.substring(0, 2)} : {r.modTm.substring(2, 4)} : {r.modTm.substring(4)} <br/><span>(수정함)</span>
                        </td>
                        )}
                    </tr>
                ))}
            </>
        );
    }

    const reviewContentOnChange = (e: any) => {
        setReviewContent(e.target.value);
    }

    const writeOnClick = async () => {
        if(window.confirm("작성하시겠습니까?")) {
            await write();
        }
    }

    const write = async () => {
        await API.post(`/review/write/${bookCode}/${localStorage.getItem("userId")}`, {
            reviewContent: reviewContent
        },{
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
            }
        });
    }

    const updateReviewOnClick = () => {
        setUpdate(true);
    }

    const UpdateModal = () => {
        const [updateContent, setUpdateContent] = useState("");
        const updateWrite = (e: any) => {
            setUpdateContent(e.target.value);
        }

        const updateOkOnClick = async () => {
            await API.put(`/review/update/${updateReviewNo}/${updateUserId}`, {
                reviewContent: updateContent
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }).catch((err) => {
                console.error(err);
            }).then((res) => {
                setUpdate(false);
                setIsModalOpened(false);
                window.location.reload();
            })
        }

        const updateCancelOnClick = () => {
            setUpdate(false);
            setIsModalOpened(false);
            document.body.style.overflow = "unset";
        }

        return (
            <>
                <Modal isOpen={update} onRequestClose={() => setUpdate(false)} className="updateModal" ariaHideApp={false}>
                    <textarea className="updateWriteHere" onChange={updateWrite}></textarea>
                    <button className="updateCancel" onClick={updateCancelOnClick}>취소</button>
                    <button className="updateOk" onClick={updateOkOnClick}>수정하기</button>
                </Modal>
            </>
        );
    }

    const deleteReviewOnClick = () => {
        console.log("댓글 삭제")
        console.log(updateReviewNo)
        console.log(updateUserId)
        if(window.confirm("댓글을 삭제하시겠습니까?")) {
            deleteReview().then();
        }
    }

    const deleteReview = async () => {
        await API.delete(`/review/delete/${updateReviewNo}/${updateUserId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).catch((err) => {
            console.error(err);
        }).then((res) => {
            window.location.reload();
        })
    }

    return (
        <>
            <div className="detailScreen">
                <div className="detailHeader">
                    <AfterLogin/>
                </div>
                <div className="detailBody">
                    <div className="detailBox">
                        <div className="bookImageBox">
                            <img src={bookImage} alt=""/>
                        </div>
                        <div className="bookInfoBox">
                            <div className="bookInfo">
                                <p className="bookTitle">제목: {bookName}</p>
                                <hr/>
                                <p className="bookAuthor">저자: {bookAuthor}</p>
                                <p className="isbn">ISBN: {isbn}</p>
                                <p className="bookPublisher">출판사: {bookPublisher}</p>
                                <p className="pubDate">발행일: {pubDate.substring(0, 4)} / {pubDate.substring(4, 6)} / {pubDate.substring(6)}</p>
                                <p className="bookLocation">위치: {bookLocation}</p>
                                <p className="bookState">상태: {bookState ? "대여중" : "대여가능"}</p>
                            </div>
                        </div>
                        <hr/>
                        <div className="bookContentBox">
                            <div className="bookContent" style={{height: height}}>
                                {bookContent}
                                {/*<LoremIpsum p={5}/> /!*테스트용*!/*/}
                            </div>
                            <button onClick={contentBtnOnClick} className="contentBtn">{contentBtn ? "요약" : "펼치기"}</button>
                        </div>
                        <div className="bookReviewBox">
                            <table className="bookReviewTable">
                                <thead>
                                    <tr style={{backgroundColor: "black", color: "white", height: 30}}>
                                        <th className="reviewIds">아이디</th>
                                        <th className="reviewContents">댓글</th>
                                        <th className="reviewDates">작성날짜</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {reviews.length > 0 && (
                                    <BookReviews/>
                                )}
                                {isModalOpened && (
                                    <Modal isOpen={isModalOpened} className="reviewModal" onRequestClose={() => {
                                        setIsModalOpened(false);
                                        document.body.style.overflow = "unset";
                                    }} ariaHideApp={false} style={{content: { width: 100, height:60, top: xy.y, left: xy.x }}}>
                                        <button className="reviewUpdateBtn" onClick={updateReviewOnClick}>수정하기</button>
                                        <button className="reviewDeleteBtn" onClick={deleteReviewOnClick}>삭제하기</button>
                                    </Modal>
                                )}
                                {update && (
                                    <UpdateModal/>
                                )}
                                {reviews.length === 0 && (
                                    <tr style={{height: 30}}>
                                        <td colSpan={3} className="noReview">리뷰가 없습니다.</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            <div className="addReviewBox">
                                <div className="addReview">
                                    <textarea className="writeHere" placeholder="댓글을 작성해주세요." onChange={reviewContentOnChange}></textarea>
                                    <button className="writeButton" onClick={writeOnClick}>작성하기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}