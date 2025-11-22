import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Modal, Pressable, ActivityIndicator } from 'react-native';import { SafeAreaView } from 'react-native-safe-area-context';
import NavigationBar from '../components/navigationBar';
import { useAuth } from '../contexts/AuthContext';
const API_BASE_URL = 'https://a66c310b8089.ngrok-free.app/api';
const POSTS_API_URL = `${API_BASE_URL}/posts`;
//    ### post:
// - image
// - id int Pk
// - user_id  fk
// - description String
// - likes int
// - location location
// - rating int

const posts = [
  {
    id: '1',
    user_id: 'Ivanna',
    location: '92 Rue Dupont, Schaerbeek BE',
    image: require('../assets/image.png'), // use require() for local assets
    rating: 4,
    likes: 42 ,
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    id: '2',
    user_id: 'Alex',
    location: '92 Rue Dupont, Schaerbeek BE',
    rating: 3,
    likes: 1800,
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
   {
    id: '3',
    user_id: 'Ivanna',
    location: '92 Rue Dupont, Schaerbeek BE',
    image: require('../assets/image.png'), // use require() for local assets
    rating: 4,
    likes: 100,
    description: 'Enjoying the hackathon vibes!',
  },
];
 const toggleLike = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

function formatLikes(num) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}

const PostCard = ({ item, onPress, expanded = false, onToggleLike }) => (
  <TouchableOpacity disabled={!onPress} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.post}>
      {/* ... (PostHeader and other views are the same) ... */}
      <View style={styles.postHeader}>
        <View style={styles.leftGroup}>
          <Image source={require('../assets/pissbaby.png')} style={styles.userImg} />
          <View style={styles.headerInfo}>
            <Text style={styles.username}>{item.user_id}</Text>
            <View style={styles.locationContainer}>
              <Image source={require('../assets/pin.png')} style={styles.pin} resizeMode="contain" />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.rating}>
          {expanded ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../assets/star_pressed.png')}
                style={styles.star}
              />
              <Text style={{ marginLeft: 4 }}>{item.rating}</Text>
            </View>
          ) : (
            [...Array(5)].map((_, index) => (
              <Image
                key={index}
                source={
                  index < item.rating
                    ? require('../assets/star_pressed.png')
                    : require('../assets/star.png')
                }
                style={styles.star}
              />
            ))
          )}
        </View>
      </View>

      {item.image ? (
        // Use the network image URI if available, otherwise fallback to local asset
        <Image 
          source={typeof item.image === 'number' ? item.image : { uri: item.image }} 
          style={styles.postImage} 
          resizeMode="cover" 
        />
      ) : null}

      <View style={styles.postFooter}>
        <View style={styles.likesContainer}>
          {/* Use the passed-in onToggleLike handler */}
          <TouchableOpacity onPress={() => onToggleLike(item.id)}> 
            <Image
              source={
                item.liked
                  ? require('../assets/heart_pressed.png')
                  : require('../assets/heart.png')
              }
              style={styles.heart}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.likesText}>{formatLikes(item.likes)}</Text>
        </View>

        <Text
          style={styles.description}
          numberOfLines={expanded ? undefined : item.image ? 1 : 4}
          ellipsizeMode={expanded ? undefined : 'tail'}
        >
          {item.description}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);


export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  // Replace the static array with state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const CURRENT_USER_ID = user.id; 

  // Function to fetch posts from the backend
const fetchPosts = async () => {
  setLoading(true);
  setError(null);
  try {
    // 1. Fetch data from your new API endpoint
    const response = await fetch(`${POSTS_API_URL}?page=1&limit=20`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    
    // 2. Map the backend data structure to your frontend structure
    const fetchedPosts = json.data.map(item => ({
      id: String(item.id),
      // Use joined data from Supabase: user:users(name) and location
      user_id: item.user.name, 
      location: `${item.location.latitude}, ${item.location.longitude}`, 
      // KEY CHANGE: Only set image if image_url exists, otherwise leave it undefined/null
      image: item.image_url || null, // Don't use the require() fallback here
      rating: item.rating,
      likes: item.likes,
      description: item.description,
      // For simplicity, we assume no previous like state, always start unliked for now.
      // In a real app, the backend query should check if CURRENT_USER_ID has liked the post.
      liked: false, 
    }));

    setPosts(fetchedPosts);
  } catch (e) {
    console.error('Fetch error:', e);
    setError('Could not load posts. Check server connection.');
  } finally {
    setLoading(false);
  }
};

  // Function to handle liking/unliking
  const toggleLike = async (id) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    // 1. Optimistic UI Update
    const newLikedStatus = !post.liked;
    const newLikesCount = post.likes + (newLikedStatus ? 1 : -1);
    
    // Update local state first
    setPosts(prevPosts =>
        prevPosts.map(p =>
            p.id === id
                ? { ...p, liked: newLikedStatus, likes: newLikesCount }
                : p
        )
    );

    // 2. API Call to update the backend
    try {
        const response = await fetch(`${POSTS_API_URL}/${id}/likes`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                likes: newLikesCount // Send the new calculated count
                // In a real app, you would also send the user_id for tracking
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update like status on server.');
        }
        
        // No further action needed if successful

    } catch (e) {
        console.error('API Error during like:', e);

        // 3. Revert on failure (undo the optimistic update)
        setPosts(prevPosts =>
            prevPosts.map(p =>
                p.id === id
                    ? { ...p, liked: post.liked, likes: post.likes } // Revert to original values
                    : p
            )
        );
        alert('Failed to update like. Please check your connection.');
    }
  };

  // Run fetchPosts once when the component mounts
  useEffect(() => {
    fetchPosts();
  }, []); 

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#f4d171" style={{ marginTop: 50 }} />;
    }

    if (error) {
      return <Text style={{ textAlign: 'center', color: 'red', marginTop: 50 }}>{error}</Text>;
    }
    
    return (
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard 
            item={item} 
            onPress={() => setSelectedPost(item)} 
            onToggleLike={toggleLike} // Pass the handler to PostCard
          />
        )}
        contentContainerStyle={styles.feedContainer}
      />
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, width: '100%' }} edges={['bottom']}>
    <View style={styles.homeContainer}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Recent Activity</Text>
                <TouchableOpacity style={styles.button} 
                onPress={() => alert('Header button pressed!')}>
                <Text style={styles.buttonText}>Friends</Text>
        </TouchableOpacity>
        </View>
        {/* Feed */}
        {renderContent()}
    </View>
    {/* Focused Post Modal (needs to also pass onToggleLike if you want to like from modal) */}
      <Modal
        visible={!!selectedPost}
        transparent
        //animationType="fade"
        onRequestClose={() => setSelectedPost(null)}
      >
        <Pressable style={styles.modalBackground} onPress={() => setSelectedPost(null)}>
          {/* Prevent clicks inside modal from closing it */}
          <Pressable style={styles.modalContent} onPress={() => { /* Do nothing */ }}> 
            {selectedPost && (
              <PostCard 
                item={selectedPost} 
                expanded={true} 
                style={{ width: '100%' }}  
                onToggleLike={toggleLike} // Pass the handler to modal PostCard
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    //flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    width: '100%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 50,
    paddingBottom: 10,
    padding: 20,
    //backgroundColor: '#ffffffff',
    borderBottomWidth: .3,       // 👈 line divider
    borderBottomColor: '#ccc',  // 👈 divider color
  },
button: {
    backgroundColor: '#f4d171',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  title: {
    //justifyContent: 'flex-end',
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    //fontWeight: 'bold',npx react-native-assetnpx react-native-asset
    color: '#333',
  },

  feedContainer: {
    marginTop: 10
  },

  userImg: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
post: {
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

  postHeader: {
  flexDirection: 'row',
  //alignItems: 'center',
  paddingTop: 5,
  paddingBottom: 5,
  justifyContent: 'space-between',
},

leftGroup: {
  flexDirection: 'row',
  alignItems: 'center',
},

locationContainer:{
    flexDirection: 'row',
},

  postImage: {
  width: '100%',
  height: 250,
  resizeMode: 'cover',
},
locationText:{
    fontSize: 11
},
 pin:{
    height: 12,
    width: 12,
    marginTop: 1,
    marginRight: 2
 },
  rating: {
  flexDirection: 'row',
  marginTop: 4,
  marginRight: 2
  
},
  star: {
  width: 20,
  height: 20,
  marginRight: 2,
},

headerInfo: {
  flexDirection: 'column',
  alignItems: 'flex-start', 
  paddingLeft: 5
},

postFooter: {
  flexDirection: 'row',
  alignContent: 'flex-start',
  marginTop: 8,
  marginRight: 40,
  paddingBottom: 5
},

description: {
  fontSize: 14,
  color: '#444',
},
username: {
  fontWeight: 'bold',
},

likesContainer: {
  flexDirection: 'column', 
  alignItems: 'center',      
  paddingRight: 8,
  paddingLeft: 5
},

likesText: {
  fontSize: 10,
  textAlign: 'center', 
  overflow: 'hidden'
},

heart: {
  height: 18,
  width: 18,
},
modalBackground: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)', // blurred/dim background
  justifyContent: 'center',
  alignItems: 'center',
},
modalContent: {
  backgroundColor: '#fff',
  borderRadius: 10,
  width: '95%',
  maxHeight: '80%',       // keep modal from covering entire screen
  alignItems: 'stretch',
},
});