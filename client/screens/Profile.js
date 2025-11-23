// screens/Profile.js

import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert, // <-- added for settings alert
} from "react-native";
import { supabase } from "../lib/supabase"; // <-- correct path

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  const defaultProfileImage = require('../assets/userImg.png') ;
  const settingsIcon = require("../assets/settings.png");

  const pissYellow = "#f4d171";

  // -------------------------------
  // Load user (id = 1)
  // -------------------------------
  async function loadUser() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      console.log("Error loading user:", error);
    } else {
      setUserData(data);
      loadPosts(data.id);
    }
  }

  // -------------------------------
  // Load posts belonging to user_id
  // -------------------------------
  async function loadPosts(userId) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Error loading posts:", error);
    } else {
      setUserPosts(data);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <View style={styles.container}>

        {/* Settings Icon */}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => Alert.alert("Settings tapped!")}
        >
          <Image source={settingsIcon} style={styles.settingsIcon} />
        </TouchableOpacity>

        {/* Profile Picture */}
        <Image
          source={defaultProfileImage}
          style={styles.profileImage}
        />

        {/* User Full Name */}
        <Text style={styles.fullName}>
          {userData ? userData.name : "Loading..."} {/* <-- fixed */}
        </Text>

        {/* PissScore Box */}
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>PissScore</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>
              3
            </Text>
          </View>
        </View>

        {/* --------------------------- */}
        {/*   USER POSTS SECTION        */}
        {/* --------------------------- */}
        <Text style={styles.postsHeading}>Your Posts</Text>

        {userPosts.length === 0 ? (
          <Text style={styles.noPosts}>No posts yet.</Text>
        ) : (
          userPosts.map((post) => (
            <View key={post.id} style={styles.postCard}>

              {/* Post Image */}
              {post.image_url ? (
                <Image
                  source={{ uri: post.image_url }}
                  style={styles.postImage}
                  resizeMode="cover"
                />
              ) : null}

              {/* Post Description */}
              <Text style={styles.postDescription}>{post.description}</Text>

              {/* Post Info: Likes & Rating */}
                <View style={styles.postInfoRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={require('../assets/heart.png')}
                      style={styles.heart}
                    />
                    <Text style={{ marginLeft: 4 }}>{post.rating}</Text>
                  </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={require('../assets/star_pressed.png')}
                      style={styles.star}
                    />
                    <Text style={{ marginLeft: 4 }}>{post.likes}</Text>
                </View>
                </View>

              {/* Post Date */}
              <Text style={styles.postDate}>
                {new Date(post.created_at).toLocaleString()}
              </Text>
            </View>
          ))
        )}

      </View>
    </ScrollView>
  );
}

// -----------------------
// STYLES
// -----------------------
const styles = StyleSheet.create({
  container: {
    paddingVertical: 50,
    alignItems: "center",
    backgroundColor: "#fff",
    minHeight: "100%",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#f4d171",
    marginTop: 20,
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
  settingsButton: {
    position: "absolute",
    top: 30,
    right: 25,
    zIndex: 99,
  },
  settingsIcon: {
    width: 28,
    height: 28,
  },

  // POSTS SECTION
  postsHeading: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: "700",
    alignSelf: "flex-start",
    marginLeft: 20,
    color: "#000",
  },

  noPosts: {
    marginTop: 10,
    fontSize: 15,
    color: "#777",
  },

  postCard: {
     width: "90%",
      backgroundColor: '#fff',
      overflow: 'hidden',
      borderWidth: .2,  
      borderColor: '#ccc', 
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      padding: 13,
      marginHorizontal: 12, 
      marginBottom: 10, 
  },

    star: {
  width: 20,
  height: 20,
  marginRight: 2,
},
  heart: {
  height: 15,
  width: 15,
  resizeMode: 'contain', 
},

  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },

  postDescription: {
    fontSize: 14,
    marginBottom: 8,
  },

  postInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postLikes: {
    fontSize: 13,
    fontWeight: "600",
  },
  postRating: {
    fontSize: 13,
    fontWeight: "600",
  },
  postDate: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 5,
  },
});
