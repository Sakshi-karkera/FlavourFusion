
// Ensure that TouchableOpacity and other necessary components are imported
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  FlatList, 
  ActivityIndicator // Importing ActivityIndicator for loading symbol
} from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CUISINE_FILTERS, DIET_FILTERS, DISH_FILTERS, HEALTH_FILTERS, MEAL_FILTERS } from '../Data';

const Search = () => {
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const [selectedDish, setSelectedDish] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedHealth, setSelectedHealth] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading symbol

  const searchRecipe = () => {
    setLoading(true); // Set loading to true when search starts
    console.log(search);
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    let url=''
    if(selectedHealth==''&&selectedCuisine==''&&selectedDiet==''&&selectedDish=='' ){
      url=`https://api.edamam.com/api/recipes/v2?type=public&q=${search}&app_id=d037f115&app_key=%20c9a91814509c720e8b8db939aeeae8a9`
    }else if(selectedCuisine!=''){
      url=`https://api.edamam.com/api/recipes/v2?type=public&q=${search}&app_id=d037f115&app_key=%20c9a91814509c720e8b8db939aeeae8a9&cuisineType=${selectedCuisine}`
    }else if(selectedDiet!=''){
      url=`https://api.edamam.com/api/recipes/v2?type=public&q=${search}&app_id=d037f115&app_key=%20c9a91814509c720e8b8db939aeeae8a9&cuisineType=${selectedDiet}`
    }else if(selectedHealth!=''){
      url=`https://api.edamam.com/api/recipes/v2?type=public&q=${search}&app_id=d037f115&app_key=%20c9a91814509c720e8b8db939aeeae8a9&cuisineType=${selectedHealth}`
    }else if(selectedDish!=''){
      url=`https://api.edamam.com/api/recipes/v2?type=public&q=${search}&app_id=d037f115&app_key=%20c9a91814509c720e8b8db939aeeae8a9&cuisineType=${selectedDish}`
    }else if(selectedCuisine!='' && selectedDiet!='' && selectedHealth!='' && selectedDish!=''){
      url=`https://api.edamam.com/api/recipes/v2?type=public&q=${search}&app_id=d037f115&app_key=%20c9a91814509c720e8b8db939aeeae8a9&cuisineType=${selectedDish}&cuisineType=${selectedCuisine}&cuisineType=${selectedDiet}&cuisineType=${selectedHealth}`

    }

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then(result => {
        console.log(result);
        setRecipes(result.hits);
        setLoading(false); // Set loading to false when search completes
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Set loading to false in case of error
      });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => {
        navigation.goBack()
      }}>
        <Image source={require('../images/back.png')} style={styles.backIcon} />
      </TouchableOpacity>
      <View style={styles.searchBox}>
        <Image source={require('../images/search.png')} style={styles.searchIcon} />
        <TextInput value={search} onChangeText={setSearch} style={styles.input} placeholder='Search here....' />
        {search != ' ' &&
          <TouchableOpacity onPress={() => { setSearch(' '); setRecipes([]) }}>
            <Image style={styles.close} source={require('../images/close.png')} />
          </TouchableOpacity>
        }
      </View>
      {search != ' ' && (
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={styles.searchTitle} onPress={() => {
            setRecipes([]);
            searchRecipe();
          }}>Search</Text>
        </TouchableOpacity>)}
      {loading ? ( // Conditionally render loading symbol
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="orange" />
      ) : (
        <FlatList data={recipes} renderItem={({ item, index }) => {
          return (
            <TouchableOpacity style={styles.recipeItem} onPress={() => {
              navigation.navigate('Details', { data: item });
            }}>
              <Image source={{ uri: item.recipe.image }} style={styles.itemImage} />
              <View>
                <Text style={styles.title}>{item.recipe.label.length > 40 ? item.recipe.label.substring(0, 40) + "...." : item.recipe.label}</Text>
                <Text style={styles.source}>{item.recipe.source}</Text>
              </View>
            </TouchableOpacity>
          )
        }} />
      )}
      {recipes && recipes.length > 0 ? (
        <TouchableOpacity style={styles.filterBtn} onPress={() => {
          setShowModal(true)

        }}>
          <Image source={require('../images/sort.png')} style={styles.close} />
        </TouchableOpacity>
      ):null}

      <Modal
        onBackdropPress={() => setShowModal(false)}
        onBackButtonPress={() => setShowModal(false)}
        isVisible={showModal}
        backdropColor='rgba(0,0,0,.5)'
        style={{ margin: 0 }}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Image style={styles.close} source={require('../images/close.png')} />
            </TouchableOpacity>
          </View>
          <Text style={styles.heading}>Dish Type</Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={DISH_FILTERS}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[styles.filterItem, { backgroundColor: selectedDish === item ? 'orange' : 'transparent' }]}
                onPress={() => setSelectedDish(item)}>
                <Text style={{color:'black'}}>{item}</Text>
              </TouchableOpacity>
            )}
          />
           <Text style={styles.heading}>Cuisine </Text>
          <View>
            <FlatList showsHorizontalScrollIndicator={false} horizontal data={CUISINE_FILTERS} renderItem={({ item, index }) => {
              return (
                <TouchableOpacity style={[styles.filterItem, { backgroundColor: selectedCuisine === item ? 'orange' : 'transparent' }]}
                onPress={() => setSelectedCuisine(item)}>
                
                  <Text style={{color:'black'}}>{item}</Text>
                </TouchableOpacity>
              )
            }} />
          </View>
          <Text style={styles.heading}>Heath</Text>
          <View>
            <FlatList showsHorizontalScrollIndicator={false} horizontal data={HEALTH_FILTERS} renderItem={({ item, index }) => {
              return (
                <TouchableOpacity style={[styles.filterItem, { backgroundColor: selectedHealth === item ? 'orange' : 'transparent' }]}
                onPress={() => setSelectedHealth(item)}>
                  <Text style={{color:'black'}}>{item}</Text>
                </TouchableOpacity>
              )
            }} />
          </View>
          
          <Text style={styles.heading}>Diet</Text>
          <View>
            <FlatList showsHorizontalScrollIndicator={false} horizontal data={DIET_FILTERS} renderItem={({ item, index }) => {
              return (
                <TouchableOpacity style={[styles.filterItem, { backgroundColor: selectedDiet === item ? 'orange' : 'transparent' }]}
                onPress={() => setSelectedDiet(item)}>
                  <Text style={{color:'black'}}>{item}</Text>
                </TouchableOpacity>
              )
            }} />
          </View>
          {/* Other filter sections */}
          <TouchableOpacity
            style={styles.submitFilter}
            onPress={()=>{
              setShowModal(false)
              searchRecipe()
            }}
              // Apply Filters logic
            >
            <Text style={styles.btnText} >Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Your recipe list here */}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({

  container: {
    flex: 1,

  },
  loadingIndicator:{
    top:'15%'

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
    width: '79%',
    marginLeft: 10,
    fontSize: 16,
    color: 'black'
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
  filterBtn: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 30,
    shadowColor: 'rgba(0, 0, 0, 0.9)', // Darker shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5, // Increased opacity for a darker shadow
    shadowRadius: 4,
    elevation: 10,
    position: "absolute",
    bottom: 50,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  close: {
    width: 30,
    height: 30,
  },
  modalView: {
    width: '100%',
    paddingBottom: 50,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    height: 40
  },
  modalTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: '900',

  },

  heading: {
    fontSize: 20,
    fontWeight: '800',
    marginLeft: 20,
    marginTop: 10,

  },
  filterItem: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 15,
    borderWidth: .6,
    marginTop: 5
  },
  submitFilter: {
    width: '90%',
    height: 50,
    backgroundColor: "orange",
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: "center"

  },
  btnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',

  },



});
