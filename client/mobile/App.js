import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Welcome from "./screens/landing-screen/welcome-screen/welcome";
import SlidingImg from "./screens/landing-screen/welcome-screen/sliding-img";
import Login from "./screens/landing-screen/login-screen/login";

import Homepage from "./screens/home-screen/home/home";

import Progress from "./screens/home-screen/progress-report/sending-report/report";
import Camera from "./screens/camera/camera";

import Notification from "./screens/menu-bar/Notification";
import History from "./screens/menu-bar/Transaction";

import { AuthProvider } from "./context/authContext";
import { SocketProvider } from "./context/socketContext";
import About from "./screens/menu-bar/About";
import FeedbackComponent from "./screens/menu-bar/Feedback";

import * as Notifications from "expo-notifications";
import React, { useEffect, useRef } from "react";
import  {Alert}  from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
export default function App() {
  const navigationRef = useRef();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response, "response notif");
      const data = response.notification.request.content.data;

      if (data?.screen && navigationRef.current) {
        navigationRef.current.navigate(data.screen);
      }
    });


    return () => {
      subscription.remove(); // Clean up the subscription on unmount
    };
  }, []);

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer ref={navigationRef}>
      <AuthProvider>
        <SocketProvider>
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
            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="Feedback" component={FeedbackComponent} />

            <Stack.Screen name="Transaction" component={History} />
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
        </SocketProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
