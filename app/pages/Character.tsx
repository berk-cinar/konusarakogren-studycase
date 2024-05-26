import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/reducers/favoriteCharactersSlice';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
        Character: { characterId: string };
};

type CharacterScreenRouteProp = RouteProp<RootStackParamList, 'Character'>;

export default function Character() {
        const route = useRoute<CharacterScreenRouteProp>();
        const { characterId } = route.params;

        const [characterData, setCharacterData] = useState<any>(null);
        const [loading, setLoading] = useState(true);
        const [episodeNumbers, setEpisodeNumbers] = useState<number[]>([]);

        const dispatch = useDispatch();
        const favoriteCharacters = useSelector((state: any) => state.favoriteCharacters);

        const isFavorite = favoriteCharacters.some((character: any) => character.id === parseInt(characterId));

        useEffect(() => {
                const fetchCharacterData = async () => {
                        try {
                                const response = await fetch(`https://rickandmortyapi.com/api/character/${characterId}`);
                                const data = await response.json();
                                setCharacterData(data);

                                const episodeNumbers = data.episode.map((url: string) => {
                                        const parts = url.split('/');
                                        return parseInt(parts[parts.length - 1]);
                                });
                                setEpisodeNumbers(episodeNumbers);
                        } catch (error) {
                                console.error('Error fetching character data:', error);
                        } finally {
                                setLoading(false);
                        }
                };

                fetchCharacterData();
        }, [characterId]);

        const toggleFavorite = () => {
                if (isFavorite) {
                        dispatch(removeFavorite({ id: parseInt(characterId), name: "", status: "", species: "", type: "", gender: "", origin: { name: "", url: "" }, location: { name: "", url: "" }, image: "", episode: [] }));
                } else {
                        dispatch(addFavorite(characterData));
                }
        };

        if (loading) {
                return (
                        <SafeAreaView style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#0000ff" />
                                <Text>Loading...</Text>
                        </SafeAreaView>
                );
        }

        if (!characterData) {
                return (
                        <SafeAreaView style={styles.errorContainer}>
                                <Text>Failed to load character data.</Text>
                        </SafeAreaView>
                );
        }

        return (
                <SafeAreaView style={styles.container}>
                        <Image
                                source={{ uri: characterData.image }}
                                style={styles.characterImage}
                        />
                        <View style={styles.detailsContainer}>
                                <Text style={styles.characterName}>{characterData.name}</Text>
                                <View style={styles.characterInfoContainer}>
                                        <Text style={styles.characterInfo}>Status:</Text>
                                        <Text style={styles.characterInfoText}>{characterData.status}</Text>
                                </View>
                                <View style={styles.characterInfoContainer}>
                                        <Text style={styles.characterInfo}>Species:</Text>
                                        <Text style={styles.characterInfoText}>{characterData.species}</Text>
                                </View>
                                <View style={styles.characterInfoContainer}>
                                        <Text style={styles.characterInfo}>Gender:</Text>
                                        <Text style={styles.characterInfoText}>{characterData.gender}</Text>
                                </View>
                                <View style={styles.characterInfoContainer}>
                                        <Text style={styles.characterInfo}>Origin:</Text>
                                        <Text style={styles.characterInfoText}>{characterData.origin.name}</Text>
                                </View>
                                <View style={styles.characterInfoContainer}>
                                        <Text style={styles.characterInfo}>Location:</Text>
                                        <Text style={styles.characterInfoText}>{characterData.location.name}</Text>
                                </View>
                                <Text style={styles.episodeText}>Appeared in Episodes:</Text>
                                <View style={styles.episodeNumbersContainer}>
                                        {episodeNumbers.map((episodeNumber, index) => (
                                                <Text key={index} style={styles.episodeNumber}>{episodeNumber}</Text>
                                        ))}
                                </View>
                                <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
                                        <View style={styles.iconContainer}>
                                                <Ionicons name={isFavorite ? 'star' : 'star-outline'} size={24} color="yellow" />
                                        </View>
                                        <View style={styles.textContainer}>
                                                <Text style={styles.favoriteButtonText}>{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</Text>
                                        </View>
                                </TouchableOpacity>
                        </View>
                </SafeAreaView>
        );
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: '#f5f5f5',
                alignItems: 'center',
        },
        loadingContainer: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
        },
        errorContainer: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
        },
        characterImage: {
                width: 200,
                height: 200,
                borderRadius: 100,
                marginTop: 20,
                marginBottom: 20,
        },
        detailsContainer: {
                paddingRight: 20,
                paddingLeft: 40,
                alignItems: 'center',
        },
        characterName: {
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 8,
                textAlign: 'left',
        },
        characterInfoContainer: {
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
        },
        characterInfo: {
                marginRight: 5,
                fontWeight: 'bold',
                marginLeft: 60,
        },
        characterInfoText: {
                flex: 1,
                textAlign: 'left',
        },
        episodeText: {
                marginTop: 10,
                marginBottom: 5,
                fontWeight: 'bold',
                fontSize: 16,
                textAlign: 'left',
        },
        episodeNumbersContainer: {
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginBottom: 10,
        },
        episodeNumber: {
                marginRight: 10,
                marginBottom: 5,
                fontSize: 16,
                fontWeight: 'bold',
        },
        favoriteButton: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
                padding: 10,
                backgroundColor: 'white',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#ccc',
                width: 220,
                height: 50,
        },
        iconContainer: {
                width: 24,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center',
        },
        textContainer: {
                marginLeft: 8,
                justifyContent: 'center',
                alignItems: 'center',
        },
        favoriteButtonText: {
                fontSize: 16,
                color: 'black',
        },
});
