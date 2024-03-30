import "./style.css";
import BeforeLogin from "../../main/beforeLogin";

export default function BookSimple() {
    return (
        <>
            <div className="simpleScreen">
                <div className="simpleHeader">
                    <BeforeLogin/>
                </div>
                <div className="simpleBody">
                    간단조회
                </div>
            </div>
        </>
    );
}