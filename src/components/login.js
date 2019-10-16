import React from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert
} from "react-native";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from "react-native-router-flux";
import * as Progress from "react-native-progress";
import {
  responsiveHeight
} from "react-native-responsive-dimensions";

import * as userActions from "../actions/userActions";
import {getDataError, getDataSuccess, getDataPending} from '../reducers/fetchdata';

import styles from "./loginStyle";
import fonts from "../sharedStyles/fontStyle";

class LoginComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: this.props.pending
    };
  }

  componentWillReceiveProps(nextProps){
    console.log("nextProps === ", nextProps);
    this.setState({ isLoading: nextProps.pending });
    if(nextProps.pending === false){
      const responseData = nextProps.data;
      if(Object.keys(responseData).includes("message")){
        console.log("login error")
      }
      else if(Object.keys(responseData).includes("id")){
        console.log("login success");
        window.currentUser = responseData;
        userActions._storeData("logged", true);
        userActions._storeData("userInfo", responseData);
        Actions.reset("customTabNavigator", { tabIndex: 0 });
      }
    }
  }

  onSignin(flag) {
    if (flag) {
      this.onUserSignin();
    } else {
      this.onUserSignup();
    }
  }

  onFacebook() {
    console.log("facebook login");
  }

  async checkMailExist(mail) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (reg.test(mail)) {
      console.log("exist email check")
    }
  }

  onUserSignup() {
    const { userEmail, userPwd, userFname, userLname } = this.props;
    if (userFname === "" || userLname === "") {
      this.showAlert("Enter full name please.");
      return;
    }

    if (userEmail === "" || userPwd === "") {
      this.showAlert("Enter email or password please.");
      return;
    }
   
    if (userActions.verficationEmail(userEmail)) {
      const userData = new FormData()
      userData.append('email', userEmail);
      userData.append('last_name', userLname);
      userData.append('first_name', userFname);
      userData.append('password', userPwd);
      this.props.actions.userSignup(userData);
    }else{
      if (userEmail === "" || userPwd === "") {
        this.showAlert("Enter valid email address please.");
        return;
      }
    }
  }

  onUserSignin() {
    const { userEmail, userPwd } = this.props;

    if (userEmail === "" || userPwd === "") {
      this.showAlert("Enter email or password.");
      return;
    }
    
    if (userActions.verficationEmail(userEmail)) {
      const userData = new FormData()
      userData.append('email', userEmail);
      userData.append('password', userPwd);
      this.props.actions.userLogin(userData);
    }else{
      if (userEmail === "" || userPwd === "") {
        this.showAlert("Enter valid email address please.");
        return;
      }
    }
    // Actions.reset("customTabNavigator", { tabIndex: 0 });
  }

  showAlert(message) {
    Alert.alert(
      "",
      message,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  }

  render() {
    return (
      <View style={styles.input_container}>
        <TouchableOpacity
          onPress={() => this.onSignin(this.props.isLogin)}
          style={
            this.props.hasAcceptedTerms !== undefined
              ? this.props.hasAcceptedTerms
                ? styles.signin_container
                : styles.signin_container_off
              : styles.signin_container
          }
        >
          <Text style={[styles.signin_txt, fonts.montserrat_regular]}>
            {this.props.isLogin ? "Sign In" : "Sign Up"}
          </Text>
          {this.state.isLoading && (
            <Progress.CircleSnail
              color={"#fff"}
              style={{
                position: "absolute",
                top: responsiveHeight(2),
                right: responsiveHeight(3),
                zIndex: 10
              }}
              size={responsiveHeight(4)}
              indeterminate={true}
            />
          )}
        </TouchableOpacity>

        <View>
          <Text style={[styles.input_container_ortxt, fonts.montserrat_medium]}>
            {"or connect with social"}
          </Text>

          <TouchableOpacity
              onPress={() => this.onFacebook()}
              style={styles.social_container}
            >
              <Image
                style={styles.socialIcon}
                source={require("../../assets/icons/facebook.png")}
                resizeMode="contain"
              />
              <Text style={[styles.social_txt, fonts.montserrat_regular]}>
                {"Facebook"}
              </Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const mapStateToProps = state => ({
  error: getDataError(state.fetchdata),
  data: getDataSuccess(state.fetchdata),
  pending: getDataPending(state.fetchdata)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      userLogin: userActions.userLogin,
      userSignup: userActions.userSignup
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);
