import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";

export default function App() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const [imageHeight, setImageHeight] = useState(200);
  const [location, setLocation] = useState("");

  const totalStars = 5;
  const starColor = "#f4d171";

  const uploadIcon = require("./assets/upload_icon.png");
  const stockImage = require("./assets/stock_image.png");

  const { width: screenWidth } = Dimensions.get("window");
  const contentPadding = 40;

  const maxRatingFont = 120;
  const maxStarFont = 50;
  const scaleFactor = Math.min(1, (screenWidth - contentPadding) / 400);

  const ratingFontSize = maxRatingFont * scaleFactor;
  const starFontSize = maxStarFont * scaleFactor;

  useEffect(() => {
    if (imageUploaded) {
      Image.getSize(
        Image.resolveAssetSource(stockImage).uri,
        (width, height) => {
          const ratio = (screenWidth - contentPadding) / width;
          setImageHeight(height * ratio);
        },
        (error) => console.error("Failed to get image size:", error)
      );
    }
  }, [imageUploaded]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Small Heading */}
        <Text style={styles.heading}>Post Review</Text>

        {/* Rating */}
        <Text style={[styles.rating, { fontSize: ratingFontSize }]}>
          {rating.toFixed(1)}
        </Text>

        {/* Stars */}
        <View style={styles.starsContainer}>
          {Array.from({ length: totalStars }).map((_, index) => {
            const starNumber = index + 1;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setRating(starNumber)}
              >
                <Text
                  style={[
                    styles.star,
                    { color: starNumber <= rating ? starColor : "#ccc" },
                    { fontSize: starFontSize },
                    styles.starShadow,
                  ]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Review Text Box */}
        <TextInput
          style={styles.reviewBox}
          placeholder="Write something about this location..."
          multiline={true}
          numberOfLines={4}
          value={review}
          onChangeText={setReview}
        />

        {/* Row: Upload button + Location Search */}
        <View style={styles.rowContainer}>
          {!imageUploaded && (
            <TouchableOpacity
              style={[styles.uploadButton, styles.uploadShadow]}
              onPress={() => setImageUploaded(true)}
            >
              <Image source={uploadIcon} style={styles.uploadIcon} />
            </TouchableOpacity>
          )}

          <View
            style={[
              styles.inputWrapper,
              !imageUploaded && { marginLeft: 10 },
            ]}
          >
            <TextInput
              style={styles.locationInput}
              placeholder="Search location..."
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>

        {/* Uploaded Image */}
        {imageUploaded && (
          <View
            style={[
              { marginTop: 10, width: screenWidth - contentPadding },
              styles.uploadedImageWrapper,
            ]}
          >
            <Image
              source={stockImage}
              style={[
                styles.uploadedImage,
                {
                  width: screenWidth - contentPadding,
                  height: imageHeight,
                },
              ]}
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => setImageUploaded(false)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Publish Button */}
        <TouchableOpacity
          style={styles.publishButton}
          onPress={() => alert("Review Published!")}
        >
          <Text style={styles.publishButtonText}>Publish</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  container: {
    width: "100%",
    alignItems: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  rating: {
    fontWeight: "bold",
  },
  starsContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  star: {
    marginHorizontal: 5,
  },
  starShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  reviewBox: {
    marginTop: 30,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    textAlignVertical: "top",
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
  },
  uploadButton: {
    backgroundColor: "#ddd",
    width: 100,
    height: 100,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  uploadIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  locationInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    width: "100%",
  },
  uploadedImageWrapper: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  uploadedImage: {
    borderRadius: 10,
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  publishButton: {
    marginTop: 20,
    backgroundColor: "#f4d171",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 50,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  publishButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});
