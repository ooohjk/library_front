import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./components/main/main";
import Login from "./components/login/login";
import Join from "./components/join/join";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Main/>}></Route>
                <Route path={"/join"} element={<Join/>}></Route>
                <Route path={"/login"} element={<Login/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
