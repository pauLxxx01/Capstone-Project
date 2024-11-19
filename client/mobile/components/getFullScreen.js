import { Dimensions } from "react-native";

const logDeviceDimensions = (statusBarHeight, fullScreenHeight) => {
  console.log(
    `Device Dimensions: \n- Status bar Height: ${statusBarHeight}\n- Screen Height: ${
      Dimensions.get("screen").height
    }\n- Full Screen Height: ${fullScreenHeight}`
  );
};

const getFullScreenHeight = () => {
  const fullScreenHeight = Dimensions.get("screen").height;
  return fullScreenHeight;
};

const statusBarSize = () => {
  const statusBarHeight =
    Dimensions.get("screen").height - Dimensions.get("window").height;
  return statusBarHeight;
};
export { getFullScreenHeight, statusBarSize };
