import * as React from "react";
import { Text, View, Image } from "react-native";
import {
  createBottomTabNavigator
} from "react-navigation";
import homeScreen from "./home/homeScreen";
import settingScreen from "./setting/settingScreen";

import styles from "./tabNavigatorStyle";
import colorStyle from "../../sharedStyles/colorStyle";
import fonts from "../../sharedStyles/fontStyle";

class customTabNavigator extends React.Component {
  
  render() {
    return (
      <BaseNavigator/>
    );
  }
}

export const BaseNavigator = createBottomTabNavigator(
  {
    HOME: {
      screen: homeScreen,
      navigationOptions: ({ screenProps }) => ({
        tabBarIcon: ({ focused }) =>
          screenProps.isActiveMenu ? (
            <View style={styles.tabItem_container}>
              <Image
                resizeMode="contain"
                source={require("../../../assets/icons/icon_tab_home.png")}
                style={[
                  styles.tabaricon,
                  { tintColor: colorStyle.colorInactiveTab }
                ]}
              />
              <Text
                allowFontScaling={false}
                style={[styles.unfocusedicontext, fonts.montserrat_medium]}
              >
                {" "}
                Home{" "}
              </Text>
            </View>
          ) : (
            <View style={styles.tabItem_container}>
              <Image
                resizeMode="contain"
                source={require("../../../assets/icons/icon_tab_home.png")}
                style={[
                  styles.tabaricon,
                  focused
                    ? { tintColor: colorStyle.colorMainGray }
                    : { tintColor: colorStyle.colorInactiveTab }
                ]}
              />
              <Text
                allowFontScaling={false}
                style={[
                  focused ? styles.focusedicontext : styles.unfocusedicontext,
                  fonts.montserrat_medium
                ]}
              >
                {" "}
                Home{" "}
              </Text>
            </View>
          ),
        tabBarOnPress: ({ navigation, defaultHandler, jumpToIndex }) => {
          defaultHandler();
          navigation.navigate("home");
        }
      })
    },
    SETTINGS: {
      screen: settingScreen,
      navigationOptions: ({ screenProps }) => ({
        tabBarIcon: ({ focused }) => (
          <View style={styles.tabItem_container}>
            <Image
              resizeMode="contain"
              source={require("../../../assets/icons/icon_tab_menu.png")}
              style={[
                styles.tabaricon,
                focused
                  ? { tintColor: colorStyle.colorMainGray }
                  : { tintColor: colorStyle.colorInactiveTab }
              ]}
            />
            <Text
              allowFontScaling={false}
              style={[
                focused ? styles.focusedicontext : styles.unfocusedicontext,
                fonts.montserrat_medium
              ]}
            >
              {" "}
              Settings{" "}
            </Text>
          </View>
        ),
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          const { isFocused } = navigation;
          if (!isFocused()) {
            defaultHandler();
          }        
        }
      })
    },   
  },
  {
    tabBarOptions: {
      showLabel: false,
      style: { borderTopColor: "transparent" }
    },
    initialRouteName: "HOME"
  }
);

export default customTabNavigator;
