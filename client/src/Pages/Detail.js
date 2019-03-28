import React, { Component } from "react";
import API from "../utils/API";

  class Detail extends Component {
    // Setting this.state.friends to the friends json array
    state = {
        card:{}
    };
    componentDidMount() {
        API.getPost(this.props.match.params.id)
          .then(res => this.setState({ card: res.data }))
          .catch(err => console.log(err));
     }
 
    // Map over this.state.friends and render a FriendCard component for each friend object
    render() {
      return (
          <div>
              {/* <h1>User Rating: {this.state.card.user.rating}/5</h1> */}
            <div className="img-container">
                <img alt={this.state.card.title} src={this.state.card.image} />
             </div>
            <h2>{this.state.card.title}</h2>
            <h3>{this.state.card.price}</h3>
            <h4>{this.state.card.description}</h4>
          </div>
      );
    }
  }
  
  export default Detail;