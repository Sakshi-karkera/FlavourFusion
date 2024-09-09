import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'react-native-animatable';
import { FlatList } from 'react-native-gesture-handler';
import { MEAL_FILTERS } from '../Data';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { FAB } from '@rneui/themed';
import Snackbar from 'react-native-snackbar';
import { AppwriteContext } from '../appwrite/AppwriteContext';

const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity);

const HomeHeader = ({ handleLogout }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <Animatable.Text animation={'slideInDown'} style={styles.logo}>RecipeRef</Animatable.Text>
      <FAB
        style={styles.logoutBtn}
        placement='right'
        color='orange'
        size='small'
        icon={{ name: 'logout', color: 'white' }}
        onPress={handleLogout}
      />
    </View>
  );
};

const CategoryList = ({ navigation }) => (
  <View>
    <Animatable.Text animation={'slideInUp'} style={styles.heading}>Categories</Animatable.Text>
    <FlatList
      horizontal
      data={MEAL_FILTERS}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.title}
      renderItem={({ item }) => (
        <AnimatedBtn
          onPress={() => navigation.navigate("RecipeByCategory", { data: item.title })}
          animation={'slideInUp'}
          activeOpacity={0.7}
          style={styles.categoryItem}
        >
          <View style={styles.card}>
            <Image source={item.icon} style={styles.categoryIcon} />
          </View>
          <Text style={styles.category}>{item.title}</Text>
        </AnimatedBtn>
      )}
    />
  </View>
);

const TrendyRecipes = ({ navigation, recipes, loading }) => (
  <View>
    <Animatable.Text animation={'slideInUp'} style={styles.heading}>Trendy Recipes</Animatable.Text>
    {loading ? (
      <ActivityIndicator style={styles.loadingIndicator} size="large" color="orange" />
    ) : (
     <FlatList
        data={recipes}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} // Set number of columns to 2
        renderItem={({ item }) => (
          <AnimatedBtn
            animation={'slideInUp'}
            style={styles.recipeItem}
            onPress={() => navigation.navigate("Details", { data: item })}
          >
            <Image source={{ uri: item.recipe.image }} style={styles.recipeImage} />
            <View style={styles.recipeLabelContainer}>
              <Text style={styles.recipeLabel}>{item.recipe.label}</Text>
            </View>
          </AnimatedBtn>
        )}
      />
    )}
  </View>
);

const Home = () => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { appwrite, setIsLoggedIn } = useContext(AppwriteContext);
  const [userData, setUserData] = useState();

  const handleLogout = () => {
    appwrite.logout()
      .then(() => {
        setIsLoggedIn(false);
        Snackbar.show({
          text: 'Logout Successful',
          duration: Snackbar.LENGTH_SHORT
        });
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Logout Error: ', error);
      });
  };

  useEffect(() => {
    appwrite.getCurrentUser()
      .then(response => {
        if (response) {
          const user = {
            name: response.name,
            email: response.email
          };
          setUserData(user);
        }
      })
      .catch(error => {
        console.error('Get User Error: ', error);
      });
  }, [appwrite]);

  useEffect(() => {
    getTrendyRecipes();
  }, []);

  const getTrendyRecipes = () => {
    setLoading(true);

    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch("https://api.edamam.com/api/recipes/v2?type=public&q=food&app_id=d037f115&app_key=c9a91814509c720e8b8db939aeeae8a9", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.hits);
        setRecipes(result.hits);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        Snackbar.show({
          text: 'Failed to fetch recipes. Please try again later.',
          duration: Snackbar.LENGTH_SHORT
        });
      });
  };

  return (
<View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <StatusBar barStyle="dark-content" />
     
      <View style={styles.topview}>
        <Animatable.Image animation={'slideInUp'} source={require('../images/cooking.jpg')} style={styles.banner} />
        <View style={styles.transparentView}>
          <View style={styles.header}>
            <Animatable.Text animation={'slideInUp'} style={styles.logo}>RecipeRef</Animatable.Text>
            <FAB
              style={styles.logoutBtn}
              placement='right'
              color='orange'
              size='large'
              title="logout"
              icon={{ name: 'logout', color: 'white' }}
              onPress={handleLogout}
            />
          </View>
          <AnimatedBtn animation={'slideInUp'} activeOpacity={.8} style={styles.SearchBox} onPress={() => {
            navigation.navigate("Search");
          }}>
            <Image source={require('../images/search.png')} style={styles.search} />
            <Text style={styles.placeholder}>Please search here.... </Text>
          </AnimatedBtn>
          <Animatable.Text animation={'slideInUp'} style={styles.note}>Search 1000+ recipes easily with one click</Animatable.Text>
        </View>
      </View>
      

      <CategoryList navigation={navigation} />
      <TrendyRecipes navigation={navigation} recipes={recipes} loading={loading} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 0, // Adjust the marginTop to move the header higher
  },
  logoutBtn: {
    position: 'absolute',
    right: -10,
    top: -100, // Adjust the top position to move the logout button higher
  },
  logo: {
    fontSize: 35,
    color: 'white',
    fontWeight: '450',
    top: -50, // Adjust the marginTop to move the "FlavorFusion" text higher
  },
  
  loadingIndicator: {
    position: 'absolute',
    top: '70%',
    left: '50%',
  },
  topview: {
    width: '100%',
    height: '40%'
  },
  
  banner: {
    width: '100%',
    height: '100%'
  },
  transparentView: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,.7)',
    justifyContent: 'center'
  },
  SearchBox: {
    width: '95%',
    height: 60,
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    marginHorizontal: 10,
    marginTop: 20
  },
  search: {
    width: 30,
    height: 30
  },
  placeholder: {
    marginLeft: 15,
    fontSize: 20,
    color: '#9e9e9e'
  },
  
  note: {
    fontSize: 18,
    color: 'white',
    width: '90%',
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: '350',
    marginTop: 20
  },

  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: 'black',
    marginLeft: 10,
    marginTop: 10
  }, categoryItem: {
    width: 120,
    height: 150,
    margin: 10,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  category: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 5,
  },
  recipeItem: {
    width: 180,
    height: 220,
    marginLeft: 20,
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 10,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  recipeLabelContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
  },
  recipeLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
