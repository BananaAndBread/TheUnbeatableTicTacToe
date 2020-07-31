import React from "react";
import "./modal.css"
function Modal(props){
    return (
        <div className="modal">
            <div className="modal__card">
                {props.children}
            </div>
        </div>
    )
}
export default Modal
