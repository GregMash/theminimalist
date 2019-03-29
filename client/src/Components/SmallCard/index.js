import React from "react";
import {Link} from "react-router-dom";

function SmallCard(props) {
    return (
        <div className="col-md-2">
          <div className="thumbnail">
           {/* eslint-disable-next-line */}
            <Link to ={'/' + props.id}>
              <img src={props.image} alt={props.title} style={{width:"100%"}}/>
              <div className="caption text-center">
                <h5 className="card-title">{props.title}</h5>
                <p className="card-text">${props.price}/day</p>
              </div> 
              </Link>
   
          </div>
        </div>
    );
  }
  
  export default SmallCard;
  