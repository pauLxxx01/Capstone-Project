import React, { useEffect, useRef, useState } from "react";
import { Animated, View, Text, StyleSheet, Easing } from "react-native";
import { Bar } from "react-native-progress";
import { getFullScreenHeight } from "../getFullScreen";

const ProgressBar = ({ progress }) => {
  const [indeterminate, setIndeterminate] = useState(true);
  const [color, setColor] = useState(""); 

  useEffect(() => {
    if (progress == 100) {
      setIndeterminate(false);
      setColor("#4caf50");
    } else {
      setColor("#800000");
      const interval = setInterval(() => {
        setIndeterminate((prevState) => !prevState);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [progress]);

  return (
    <>
      <Bar
        indeterminate={indeterminate}
        color={color}
        progress={progress / 100}
        width={getFullScreenHeight() * 0.35}
      />
      <Text style={{ color: color, fontSize: 8 }}>{progress}%</Text>
    </>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    height: 30,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4caf50",
  },
  progressText: {
    position: "absolute",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default ProgressBar;
