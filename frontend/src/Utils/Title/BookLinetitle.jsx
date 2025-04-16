import React from 'react'
import { useNavigate } from "react-router-dom";
import './BookLinetitle.css'

const Title = () => {
    const navigate = useNavigate();
    
    return (

        <h3 onClick={() => navigate("/")} className="title">
            BOOKLINE</h3>
    );
};
export default Title;
