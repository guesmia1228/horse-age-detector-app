import React, { Component } from 'react';
import {
  View,
  Text,
  Image,  
  FlatList,
  TextInput
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as userActions from "../../../actions/userActions";
// import {getDataError, getDataSuccess, getDataPending} from '../../../reducers/fetchdata';
import {getListError, getListSuccess, getListPending} from '../../../reducers/fetchhistory';
import HorseListItem from "../../../components/horseListItem";
import ProgressBar from "../../../components/progressBar";
import styles from "./historyScreenStyle";
import fonts from "../../../sharedStyles/fontStyle";
import serverurl from '../../../../config/const/serverurl';

class historyScreen extends Component{
  constructor(props) {
    super(props);
    this.state = {
      horseList: [],
      searchName: "",
      isShowModal: this.props.pending
    };

    this.reloadHorseList = this.reloadHorseList.bind(this);
  }

  componentDidMount(){    
    this.props.actions.fetchHorseList(window.currentUser["id"]);
    this.setState({isShowModal: true});
  }

  componentWillReceiveProps(nextProps){ 
    if(nextProps.pending === false){
      this.setState({isShowModal: false});
      const responseData = nextProps.data;
      if(responseData.length > 0){   
        console.log("load success  ss=====", responseData);     
        let list = [];
        responseData.map(item=>{
          item["file"] = serverurl.server_url + item["file"];
          list.push(item);
        })
        this.setState({horseList: list});
      }
    }
  }

  reloadHorseList(){
    this.props.actions.fetchHorseList(window.currentUser["id"]);
    this.setState({isShowModal: true});
  }

  goDetail =(item)=>{
    this.props.navigation.navigate("details", {
      detailItem: item
    });
  }

  onCreate(){
    this.props.navigation.navigate("create", {reloadHorseList: this.reloadHorseList});
  }

  render(){
    const{horseList, isShowModal, searchName} = this.state;
    let filterList = [];
    if(searchName !== "" && horseList.length > 0){      
      horseList.map(item=>{
        if(item.name.toLowerCase().includes(searchName.toLowerCase())){
          filterList.push(item);
        }
      })
    }else{
      filterList = horseList;
    }

    return(
      <View style={styles.container}>
        <View style={styles.topbar_wrap}>
          <Text style={[styles.title, fonts.montserrat_bold]}>HISTORY</Text>        
        </View>
        <View style={styles.search_wrap}>          
          <Image 
            style={styles.searchIcon}
            source={require("../../../../assets/icons/icon_search.png")}
            resizeMode="contain"
          />
          <TextInput 
            placeholder="Search Name"            
            inlineImageLeft="search_icon"
            returnKeyType="done"
            onChangeText={text => {this.setState({searchName: text})}}
          />
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={filterList}
          renderItem={({ item, index }) => (
            <HorseListItem
              key={index}
              horseItem={item}
              onClick={()=>this.goDetail(item)}
            />
          )}
        />
        <ProgressBar 
          isPending={isShowModal}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  error: getListError(state.fetchhistory),
  data: getListSuccess(state.fetchhistory),
  pending: getListPending(state.fetchhistory)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      fetchHorseList: userActions.fetchHorseList
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(historyScreen);
