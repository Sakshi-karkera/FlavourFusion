import { View, Text, StyleSheet, Touchable } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image } from 'react-native-animatable';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity)


const Details = () => {
  const route = useRoute();
  const [selectedTab, setSelectedTab] = useState(0);
  const navigation = useNavigation();
  return (
    <View contentContainerStyle={styles.container}>
     
        <Animatable.Image source={{ uri: route.params.data.recipe.image }} style={styles.banner} animation={'slideInUp'} />
        <AnimatedBtn style={styles.backBtn} animation={'slideInUp'} onPress={() => {
          navigation.goBack()
        }} >
          <Image source={require('../images/back.png')} style={styles.backIcon} />
        </AnimatedBtn>
        <Animatable.Text animation={'slideInUp'} style={styles.title}>{route.params.data.recipe.label}</Animatable.Text>
        <Animatable.Text animation={'slideInUp'} style={styles.source}>{'added by' + route.params.data.recipe.source}</Animatable.Text>
        <Animatable.Text animation={'slideInUp'} style={styles.calories}>{"Calories:"}<Text style={{ color: 'orange' }}>{route.params.data.recipe.calories}</Text></Animatable.Text>
        <Animatable.Text animation={'slideInUp'} style={styles.calories}>{"Total Weight:"}<Text style={{ color: 'black' }}>{route.params.data.recipe.totalWeight}</Text></Animatable.Text>
        <Animatable.Text animation={'slideInUp'} style={styles.calories}>{"Meal Type:"}<Text style={{ color: 'green' }}>{route.params.data.recipe.mealType}</Text></Animatable.Text>
        <View>
          <FlatList
            data={[
              'Health',
              'Cautions',
              'Ingredients',
              'Diet',
              'Meal Type',
              'Cuisines',
              'Dish Type',
            ]}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ marginTop: 20 }}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity style={[styles.typeItem, {
                  borderWidth: selectedTab == index ? 0 : 0.5,
                  marginLeft: index == 0 ? 25 : 10,
                  borderColor: "#9e9e9e",

                  backgroundColor: selectedTab == index ? 'orange' : 'white',
                },
                ]}
                  onPress={() => {
                    setSelectedTab(index)
                  }}>
                  <Text style={{ color: selectedTab == index ? 'white' : 'black' }}>{item}</Text>
                </TouchableOpacity>
              )
            }} />
        </View>
        <FlatList
          data={
            selectedTab == 0
              ? route.params.data.recipe.healthLabels
              : selectedTab == 1
                ? route.params.data.recipe.cautions
                : selectedTab == 2
                  ? route.params.data.recipe.ingredientLines
                  : selectedTab == 3
                    ? route.params.data.recipe.dietLabels
                    : selectedTab == 4
                      ? route.params.data.recipe.mealType
                      : selectedTab == 5
                        ? route.params.data.recipe.cuisineType
                        : route.params.data.recipe.dishType
          }
          renderItem={({ item, index }) => {
            return (
              <Animatable.View style={styles.lables} animation={'slideInUp'}>
                <Text>{item}</Text>
              </Animatable.View>
            )
          }} />
           {selectedTab === 7 && (
        <FlatList
          data={cookingInstructions} // Assuming cookingInstructions is an array of strings
          renderItem={({ item, index }) => {
            return (
              <Animatable.View style={styles.lables} animation={'slideInUp'}>
                <Text>{item}</Text>
              </Animatable.View>
            )
          }}
        />
      )}
     
     </View>
  )
};


export default Details
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    width: "100%",
    height: 350,
    resizeMode: 'cover',
    position: 'absolute'

  },
  backBtn: {
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: 'white',
    top: 10,
    left: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    position: 'absolute'
  },
  backIcon: {
    width: 20,
    height: 20,

  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    width: "90%",
    position: 'none',
    alignSelf: 'center',
    color: 'black',
    marginTop: 350,
  },
  source: {
    marginLeft: 20,
    marginTop: 5

  },
  typeItem: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 10,
    borderRadius: 8,
    fontSize: 25
  },
  lables: {
    width: '90%',
    alignSelf: 'center',
    height: 50,
    borderWidth: .5,
    justifyContent: 'center',
    marginTop: 10,
    borderColor: '#9e9e9e',
    paddingLeft: 10,
    color: 'black'
  },
  calories: {
    fontSize: 18,
    color: 'black',
    fontWeight: '500',
    marginTop: 10,
    marginLeft: 25
  }
});