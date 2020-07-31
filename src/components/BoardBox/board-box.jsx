import React from "react"
import './board-box.css'
function Box (props) {
    return (
        <button disabled={props.disabled} className='board__box' onClick={ props.onClick }>
            <div className='board__box__content'>
            {props.value}
            </div>
        </button>
    )
}

export default Box
