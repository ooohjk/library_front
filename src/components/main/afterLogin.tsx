const AfterLogin = () => {

    const logoutOnClick = () => {
        console.log("로그아웃 버튼 클릭!");
        localStorage.removeItem("accessToken");
        window.location.reload();
    }

    return (
        <>
            <div className="profileIcon">
                아이콘
            </div>
            <div className="logoutButtonBox">
                <button className="logoutButton" onClick={logoutOnClick}>로그아웃</button>
            </div>
        </>
    );
}

export default AfterLogin