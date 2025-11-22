// screens/Profile.js

import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function Profile() {
  const profileImage = require("../assets/stock_image.png"); 
  const settingsIcon = require("../assets/settings.png");

  const imageSize = 120;
  const pissScore = 85;

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* SETTINGS ICON (TOP RIGHT) */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => console.log("Settings Pressed")} // no navigation
        >
          <Image source={settingsIcon} style={styles.settingsIcon} />
        </TouchableOpacity>
      </View>

      {/* PROFILE PICTURE */}
      <Image
        source={profileImage}
        style={[styles.profileImage, { width: imageSize, height: imageSize }]}
      />

      {/* FULL NAME */}
      <Text style={styles.fullName}>Syed Fahad Ali</Text>

      {/* PISSSCORE BOX */}
      <View style={styles.scoreBox}>
        <Text style={styles.scoreLabel}>PissScore</Text>

        <View style={styles.scoreCircle}>
          <Text style={styles.scoreNumber}>{pissScore}</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: "center",
    backgroundColor: "#fff",
  },

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  settingsButton: {
    padding: 5,
  },

  settingsIcon: {
    width: 28,
    height: 28,
    tintColor: "#000", // optional
  },

  profileImage: {
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#f4d171",
  },

  fullName: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },

  scoreBox: {
    marginTop: 15,
    backgroundColor: "#f4d171",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 4, 
    flexDirection: "row",
    alignItems: "center",
  },

  scoreLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginRight: 10,
  },

  scoreCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  scoreNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
});
