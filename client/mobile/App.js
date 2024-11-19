import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Welcome from "./screens/landing-screen/welcome-screen/welcome";
import SlidingImg from "./screens/landing-screen/welcome-screen/sliding-img";
import Login from "./screens/landing-screen/login-screen/login";

import Homepage from "./screens/home-screen/home/home";

import Progress from "./screens/home-screen/progress-report/sending-report/report";
import Camera from "./screens/camera/camera";

import Notification from "./screens/menu-bar/Notification";

import { AuthProvider } from "./context/authContext";
import About from "./screens/menu-bar/About";
import FeedbackComponent from "./screens/menu-bar/Feedback";
import registerNNPushToken from 'native-notify';

export default function App() {
  registerNNPushToken(24898, '760ZeHdkeVxNNpUDQg7hEN');
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SlidingImg"
            component={SlidingImg}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Homepage"
            component={Homepage}
            options={{ headerShown: false }}
          />
                {/* Menu List */}
          <Stack.Screen
            name="Notification"
            component={Notification}
  
          />
   <Stack.Screen
    name="About"
    component={About}
    />
         <Stack.Screen
    name="Feedback"
    component={FeedbackComponent}
    />
          {/* Report Progress */}
          <Stack.Screen
            name="Progress"
            component={Progress}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Camera"
            component={Camera}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
