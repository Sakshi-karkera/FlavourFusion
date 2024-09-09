import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { Image } from 'react-native-animatable';
import { useNavigation, useRoute } from '@react-navigation/native';

const RecipeByCategory = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    searchRecipe();
  }, []);

  const searchRecipe = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=food&app_id=d037f115&app_key=c9a91814509c720e8b8db939aeeae8a9&mealType=${route.params.data}`, requestOptions)
      .then((response) => response.json())
      .then(result => {
        console.log(result);
        setRecipes(result.hits);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }

  return (
    <View style={Styles.container}>
      <TouchableOpacity style={Styles.backBtn} onPress={() => {
        navigation.goBack();
      }}>
        <Image source={require('../images/back.png')} style={Styles.backIcon} />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="orange" style={Styles.loadingIndicator} />
      ) : (
        <FlatList data={recipes} renderItem={({ item, index }) => {
          return (
            <TouchableOpacity style={Styles.recipeItem} onPress={() => {
              navigation.navigate("Details", { data: item });
            }}>
              <Image source={{ uri: item.recipe.image }} style={Styles.itemImage} />
              <View>
                <Text style={Styles.title}>{item.recipe.label.length > 40 ? item.recipe.label.substring(0, 40) + "...." : item.recipe.label}</Text>
                <Text style={Styles.source}>{item.recipe.source}</Text>
              </View>
            </TouchableOpacity>
          )
        }} />
      )}
    </View>
  );
};

export default RecipeByCategory;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 60,
    backgroundColor: 'white',
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  searchBox: {
    width: '90%',
    height: 50,
    borderWidth: .5,
    alignSelf: 'center',
    marginTop: 50,
    borderRadius: 8,
    borderColor: '#9e9e9e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10
  },
  searchIcon: {
    width: 30,
    height: 30,
  },
  input: {
    width: '80%',
    marginLeft: 10,
    fontSize: 16,
    color: 'black'
  },
  close: {
    width: 20,
    height: 30,
  },
  searchBtn: {
    width: '40%',
    height: 50,
    backgroundColor: 'orange',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchTitle: {
    fontSize: 16,
    color: 'black'
  },
  recipeItem: {
    width: '90%',
    height: 100,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemImage: {
    width: 90,
    height: 90,
    marginLeft: 10,
    borderRadius: 9
  },
  title: {
    fontSize: 18,
    width: '70%',
    fontWeight: '500',
    marginLeft: 10,
  },
  source: {
    fontSize: 15,
    width: '60%',
    fontWeight: '500',
    marginLeft: 10,
    marginTop: 10,
    color: 'orange'
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
