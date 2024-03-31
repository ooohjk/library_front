import "./style.css";
import BeforeLogin from "../../main/beforeLogin";
import BookInfo from "../bookInfo";

export default function BookSimple() {
    return (
        <>
            <div className="simpleScreen">
                <div className="simpleHeader">
                    <BeforeLogin/>
                </div>
                <div className="simpleBody">
                    <div className="simpleBox">
                        <BookInfo/>
                    </div>
                </div>
            </div>
        </>
    );
}