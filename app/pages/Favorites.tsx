import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavorite } from '../store/reducers/favoriteCharactersSlice';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../(tabs)/index';
import { Ionicons } from '@expo/vector-icons';

type FavoritesScreenNavigationProp = CompositeNavigationProp<
        StackNavigationProp<RootStackParamList, 'Favorites'>,
        StackNavigationProp<RootStackParamList>
>;

interface Character {
        id: number;
        name: string;
        status: string;
        species: string;
        type: string;
        gender: string;
        origin: {
                name: string;
                url: string;
        };
        location: {
                name: string;
                url: string;
        };
        image: string;
        episode: string[];
}

export default function Favorites() {
        const favoriteCharacters = useSelector((state: any) => state.favoriteCharacters);
        const dispatch = useDispatch();
        const navigation = useNavigation<FavoritesScreenNavigationProp>();

        const handleRemove = (character: Character) => {
                Alert.alert(
                        'Remove Character',
                        `Are you sure you want to remove '${character.name}' from favorites?`,
                        [
                                {
                                        text: 'Yes',
                                        onPress: () => dispatch(removeFavorite(character)),
                                },
                                {
                                        text: 'Cancel',
                                        style: 'cancel',
                                },
                        ]
                );
        };

        const renderItem = ({ item }: { item: Character }) => (
                <View style={styles.characterContainer}>
                        <Image source={{ uri: item.image }} style={styles.characterImage} />
                        <View style={styles.characterDetails}>
                                <Text style={styles.characterName}>{item.name}</Text>
                                <View style={styles.buttonContainer}>
                                        <TouchableOpacity onPress={() => navigation.navigate('Character', { characterId: item.id.toString() })} style={[styles.button, styles.viewButton]}>
                                                <Ionicons name="eye" size={24} color="green" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleRemove(item)} style={[styles.button, styles.removeButton]}>
                                                <Ionicons name="trash" size={24} color="red" />
                                        </TouchableOpacity>
                                </View>
                        </View>
                </View>
        );

        return (
                <View style={styles.container}>
                        {favoriteCharacters.length < 1 ?
                                <View style={styles.noFavoritesContainer}>
                                        <Image
                                                source={require('../../assets/images/rnm-nofavs.png')}
                                                style={styles.headerImage}
                                        />
                                        <Image
                                                source={require('../../assets/images/rnm-nofavyet.png')}
                                                style={styles.noFavoritesImage}
                                        />
                                </View>
                                :
                                <FlatList
                                        data={favoriteCharacters}
                                        renderItem={renderItem}
                                        keyExtractor={item => item.id.toString()}
                                />
                        }
                </View>
        );
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: '#f5f5f5',
                justifyContent: 'center',
        },
        noFavoritesContainer: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
        },
        headerImage: {
                width: '70%',
                height: 300,
                resizeMode: 'contain'
        },
        noFavoritesImage: {
                width: '70%',
                height: 80,
                resizeMode: 'contain',
        },
        noFavoritesText: {
                fontSize: 16,
                color: '#333',
                textAlign: 'center',
                marginTop: 20,
        },
        characterContainer: {
                flexDirection: 'row',
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#ddd',
        },
        characterImage: {
                width: 80,
                height: 80,
                borderRadius: 40,
        },
        characterDetails: {
                flex: 1,
                marginLeft: 10,
                justifyContent: "flex-start",
                marginTop: 10
        },
        characterName: {
                fontSize: 18,
                fontWeight: 'bold',
                color: '#333',
        },
        buttonContainer: {
                position: 'absolute',
                right: -2,
                bottom: 0,
                flexDirection: 'row',
                marginTop: 5,
        },
        button: {
                padding: 5,
                borderRadius: 5,
                marginRight: 5,
                alignItems: 'center',
                justifyContent: 'center',
                width: 90,
        },
        removeButton: {
                backgroundColor: '#f5c6cb',
                marginRight: 5,
        },
        viewButton: {
                backgroundColor: '#d4edda',
        },
        buttonText: {
                color: '#155724',
                fontWeight: 'bold',
        },
});

