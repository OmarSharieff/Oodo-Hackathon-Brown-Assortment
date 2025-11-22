import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, FlatList, Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigationBar from '../components/navigationBar';
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
    location: 'Berlin, Germany',
    rating: 3,
    likes: 18,
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
   {
    id: '3',
    user_id: 'Ivanna',
    location: '92 Rue Dupont, Schaerbeek BE',
    image: require('../assets/image.png'), // use require() for local assets
    rating: 4,
    likes: 42,
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

export default function HomeScreen({ navigation }) {

    const renderPost = ({item}) => (
        <View style={styles.post}>
            <View style = {styles.postHeader}>

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
                {[...Array(5)].map((_, index) => (
                    <Image
                    key={index}
                    source={
                        index < item.rating
                        ? require('../assets/star_pressed.png')        
                        : require('../assets/star.png') 
                    }
                    style={styles.star}
                    />
                ))}
                </View>
            </View>
         {/* Post image */}
        {item.image ? 
            (<Image source={item.image} style={styles.postImage} resizeMode="cover" />)    
            : null}
       
        <View style={styles.postFooter}>
            <View style={styles.likesContainer}>
                 <TouchableOpacity onPress={() => toggleLike(item.id)}>
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
                <Text style={styles.likesText}>{item.likes}</Text>
            </View>
            <Text
                style={styles.description}
                numberOfLines={item.image ? 1 : 4}   
                ellipsizeMode="tail"                 
            >
                {item.description}
              </Text>
        </View>
        </View>
    );
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
    <View style={styles.homeContainer}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Recent Activity</Text>
                <TouchableOpacity style={styles.button} 
                onPress={() => alert('Header button pressed!')}>
                <Text style={styles.buttonText}>Friends</Text>
        </TouchableOpacity>
        </View>
        {/* Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.feedContainer}
      />
      <NavigationBar></NavigationBar>
    </View>
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

  },

  userImg: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  post: {
    backgroundColor: '#fff',
    //marginBottom: 20,
    //borderRadius: 10,
    overflow: 'hidden',
    borderWidth: .2,  
    borderColor: '#ccc', 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 13
    
  },

  postHeader: {
  flexDirection: 'row',
  //alignItems: 'center',
  paddingTop: 5,
  paddingBottom: 5,
  justifyContent: 'space-between'
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

});
