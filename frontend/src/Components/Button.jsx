import React from 'react'
import { Link } from 'react-router-dom'

function Button(props) {
    return (
      <div>
        <Link to={props.route}>
          <button>{props.text}</button>
        </Link>
      </div>
    );
  }
export default Button
