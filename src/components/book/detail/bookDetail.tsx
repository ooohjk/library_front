import "./style.css";
import AfterLogin from "../../main/afterLogin";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../../apis/api";
import Modal from "react-modal";
import BookInfo from "../bookInfo";

export default function BookDetail() {

    const { option, search } = useParams();
    const [bookCode, setBookCode] = useState(0);
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
                setReviews(res?.data.data.review);
            })
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
                        <BookInfo/>
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