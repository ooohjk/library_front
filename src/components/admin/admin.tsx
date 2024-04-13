import "./style.css";
import UserManage from "./userManage";
import BookManage from "./bookManage";

export default function Admin() {

    return (
        <>
            <div className="adminScreen">
                <UserManage/>
                <BookManage/>
            </div>
        </>
    );
}