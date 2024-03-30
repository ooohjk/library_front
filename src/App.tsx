import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./components/main/main";
import Login from "./components/login/login";
import Join from "./components/join/join";
import MyPage from "./components/mypage/mypage";
import Quit from "./components/quit/quit";
import BookSimple from "./components/book/simple/bookSimple";
import BookDetail from "./components/book/detail/bookDetail";
import SearchResult from "./components/book/searchResult";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Main/>}></Route>
                <Route path={"/join"} element={<Join/>}></Route>
                <Route path={"/login"} element={<Login/>}></Route>
                <Route path={"/myPage"} element={<MyPage/>}></Route>
                <Route path={"/quit"} element={<Quit/>}></Route>
                <Route path={"/search/:option/:search"} element={<SearchResult/>}></Route>
                <Route path={"/search/simple/:option/:search"} element={<BookSimple/>}></Route>
                <Route path={"/search/detail/:option/:search"} element={<BookDetail/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
