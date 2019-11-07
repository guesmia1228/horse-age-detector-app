import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView
} from 'react-native';
import {
  responsiveWidth
} from 'react-native-responsive-dimensions';
import FastImage from 'react-native-fast-image';
import moment from "moment";

import CustomBar from "../../../components/customBar";
import styles from "./detailScreenStyle";
import fonts from "../../../sharedStyles/fontStyle";

class detailScreen extends Component{
  constructor(props) {
    super(props);
    this.state = {
      calcImgHeight: 0
    };
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  render(){
    const detailItem = this.props.navigation.getParam("detailItem");
    let age = detailItem.age === null ? 0 : detailItem.age;
    if(detailItem.image_type.toLowerCase() === "lower"){
      age = parseFloat(age) >= 17 ? "17 or Older" : parseFloat(age).toFixed(5);
    }else{
      age = parseFloat(age) >= 20 ? "20 or Older" : parseFloat(age).toFixed(5);
    }

    const{calcImgHeight} = this.state;
    return(
      <ScrollView style={styles.container}>
        <CustomBar 
          title={"Details"}
          navigate={this.props.navigation}
        />
        <View style={styles.detail_wrap}>
          <FastImage 
            resizeMode="contain"
            style={{ width: responsiveWidth(94), height: calcImgHeight }}
            source={{ uri: detailItem.file }}
            onLoad={evt =>
              this.setState({
                calcImgHeight:
                  evt.nativeEvent.height / evt.nativeEvent.width * responsiveWidth(94), // By this, you keep the image ratio
              })}
          />
          <View style={styles.detail_txt_wrap}>
            <Text style={[styles.detail_bold_txt, fonts.montserrat_semibold]}>
            {"Uploaded At: "}<Text style={[fonts.montserrat_regular]}>{moment(detailItem.uploaded_at).format('YYYY.MM.DD, h:mm:ss a')}</Text>
            </Text>
            <Text style={[styles.detail_bold_txt, fonts.montserrat_semibold]}>
            {"Image Type: "}<Text style={[fonts.montserrat_regular]}>{detailItem.image_type}</Text>
            </Text>
            <Text style={[styles.detail_bold_txt, fonts.montserrat_semibold]}>
              {"Age: "} <Text style={[fonts.montserrat_regular]}>{age}</Text>
            </Text>
            <View>
              <Text style={[styles.detail_bold_txt, fonts.montserrat_semibold]}>
                Description
              </Text>
              <Text style={[fonts.montserrat_regular]}>
                {detailItem.description}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

export default detailScreen;