import React from "react";
import { Route, Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import TopAppBar, {
  TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  // TopAppBarTitle,
} from '@material/react-top-app-bar';
// import Headline2 from "@material/react-typography";
import MaterialIcon from '@material/react-material-icon';
import Drawer, {
  DrawerHeader,
  // DrawerSubtitle,
  DrawerTitle,
  DrawerContent,
  DrawerAppContent
} from '@material/react-drawer';
import List, { ListItem, ListItemGraphic, ListItemText } from '@material/react-list';
import TextField, { Input } from "@material/react-text-field";
import Button from '@material/react-button';
import LogoutBtn from "../../Components/LogoutBtn";
import API from '../../utils/API';
import store from "../../store";
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { setCurrentUser, logoutUser } from "../../actions/authActions";

if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}


class PrivateRoute extends React.Component {
  state = {
    cards: [],
    category: "",
    open: false,
    search: "",
    city: "",
    state: "",
    zipcode: "",
    categories: [
      {
        name: "All",
        icon: "apps"
      },
      {
        name: "Electronics",
        icon: "keyboard"
      },
      {
        name: "Appliances",
        icon: "kitchen"
      },
      {
        name: "Clothing",
        icon: "layers"
      },
      {
        name: "Household",
        icon: "weekend"
      },
      {
        name: "Sports",
        icon: "directions_run"
      },
      {
        name: "Movies and Games",
        icon: "local_movies"
      },
      {
        name: "Machinery",
        icon: "power"
      },
      {
        name: "Tools",
        icon: "build"
      },
      {
        name: "Space",
        icon: "store_mall_directory"
      }
    ]
  };

  loadCity = (userID) => {
    console.log(userID)
    API.getUserCity(userID)
      .then(res => {
        this.setState({ city: res.data[0].city })
        console.log(`Current location: ${this.state.city}`)
        this.loadPopPosts()
      })
      .catch(err => console.log(err))
  }

  loadPopPosts = () => {
    API.getPopPosts(this.state.city)
      .then(res => {
        this.setState({ cards: res.data });
      }
      )
      .catch(err => console.log(err));
  };
  handleCategoryChange = (category) => {
    if (category === "All") {
      this.loadPopPosts();
    } else {
      // console.log(`category: ${category} and city: ${city}`)
      API.getCategoryPosts(category, this.state.city)
        .then(res => {
          this.setState({ cards: res.data, category });
        }
        )
        .catch(err => console.log(err));
    }
  }
  handleSearch = (search) => {
    API.search(search, this.state.city)
      .then(res => {
        this.setState({ cards: res.data, search });
      }
      )
      .catch(err => console.log(err));
  }

  handleCityChange = (city) => {
    API.saveNewCity(store.getState().auth.user.id, city)
      .then((res, req) => {
        this.loadCity(store.getState().auth.user.id)
      }
      )
      .catch(err => console.log(err));
  }
  handleZipCode = () => {
    if (this.state.zipcode.split("").length === 5 && /^[0-9]+$/.test(this.state.zipcode)) {
      API.getZipCode(this.state.zipcode)
        .then((res) => {
          this.setState({
            city: res.data.city,
            state: res.data.state
          })
          this.handleCityChange(this.state.city)
        })
        .catch(err => console.log(err));
    };
  };

  loadCityTriggered = () => {
    if (this.state.city === "") {
      this.loadCity(store.getState().auth.user.id)
    }
  }
  delete = (id) => {
    API.deletePost(id)
      .then(() => {
        this.loadPopPosts();
      }
      )
  }

  // componentDidMount() {
  //   this.loadCity(store.getState().auth.user.id);

  // }
  onChange = e => {
    // console.log(e.target.value )
    this.setState({ [e.target.id]: e.target.value });
    console.log(this.state.zipcode);
  };



  render() {
    const { component: Component, render: Render, auth, ...rest } = this.props;
    return (<Route
      {...rest}
      render={props =>
        store.getState().auth.isAuthenticated === true ? (
          <div className='drawer-container'>
            <Drawer
              modal
              open={this.state.open}
              onClose={() => this.setState({ open: false })}
            >
              <DrawerHeader> {/*defaults to div*/}
                <DrawerTitle tag='h2'> {/*defaults to h3*/}
                  Categories
                  </DrawerTitle>
                {/* <DrawerSubtitle> 
                  Isn't this cool?
                  </DrawerSubtitle> */}
              </DrawerHeader>

              <DrawerContent tag='main'>  {/*defaults to div*/}
                {/* <Button>What up?!</Button> */}
                <List singleSelection selectedIndex={this.state.selectedIndex}>
                  {this.state.categories.map((category, index) => (
                    // <CategoryWrapper
                    // key = {category}
                    // category={category}
                    // handleCategoryChange= {this.props.handleCategoryChange(category)}
                    // />
                    <ListItem key={index} onClick={
                      (e) => {
                        e.preventDefault()
                        this.handleCategoryChange(category.name)
                      }}>
                      <ListItemGraphic graphic={<MaterialIcon icon={category.icon} />} />
                      <ListItemText primaryText={category.name} />
                    </ListItem>

                  ))}
                </List>
              </DrawerContent>

            </Drawer>
            <DrawerAppContent>
              <TopAppBar>
                <TopAppBarRow>
                  <TopAppBarSection align='start'>
                    <TopAppBarIcon navIcon tabIndex={0}>
                      <MaterialIcon hasRipple icon='menu' onClick={() => this.setState({ open: !this.state.open })} />
                    </TopAppBarIcon>
                    {/* <TopAppBarTitle>
                    </TopAppBarTitle> */}
                  </TopAppBarSection>
                  <TopAppBarSection align='middle' role="toolbar">
                    <div>
                      <TextField label={this.state.city}>
                        <Input value={this.state.zipcode} id="zipcode" onChange={this.onChange} />
                      </TextField>
                      <Button raised onClick={() => {
                        // e.preventDefault();
                        this.handleZipCode()
                      }}>Change Location</Button>
                    </div>
                  </TopAppBarSection>
                  <TopAppBarSection align='end' role='toolbar'>
                    <TopAppBarIcon navIcon tabIndex={0}>
                      <Link to='/'>
                        <MaterialIcon hasRipple icon='home' />
                      </Link>
                    </TopAppBarIcon>
                    <TopAppBarIcon actionItem tabIndex={1}>

                      <Link to='/newpost'>
                        <MaterialIcon
                          aria-label="Add Item"
                          hasRipple
                          icon='add'
                          onClick={() => console.log('print')}
                        />
                      </Link>
                    </TopAppBarIcon>
                    <TopAppBarIcon actionItem tabIndex={0}>
                      <LogoutBtn />
                    </TopAppBarIcon>
                    {/* <TopAppBarIcon actionItem tabIndex={0}>
                    <MaterialIcon
                      aria-label="Logout"
                      hasRipple
                      icon='logout'
                      onClick={() => console.log('print')}
                    />
                  </TopAppBarIcon> */}
                  </TopAppBarSection>
                </TopAppBarRow>
              </TopAppBar>
            </DrawerAppContent>
            <TopAppBarFixedAdjust>
              <div className="main-container">

                <div className="main-content">
                  <Render {...props} />
                  {/* {Component}? <Component {...props} /> : <Render {...props} /> */}
                </div>
              </div>
            </TopAppBarFixedAdjust>
          </div>
        ) : (
            <Redirect to="/login" />
          )
      }
    />
    );

  }
}
PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(PrivateRoute);
// export default PrivateRoute;
