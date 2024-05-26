import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pagination from '../components/Pagination'; // Pagination bileşenini import edin

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/reducers/favoriteCharactersSlice';

type RootStackParamList = {
        Details: { id: string };
};

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

export default function Details() {
        const [episodeData, setEpisodeData] = useState<any>(null);
        const [characters, setCharacters] = useState<any[]>([]);
        const [filteredCharacters, setFilteredCharacters] = useState<any[]>([]);
        const [loading, setLoading] = useState(true);
        const [search, setSearch] = useState('');
        const [currentPage, setCurrentPage] = useState(1); // Mevcut sayfa numarasını tutar

        const route = useRoute<DetailsScreenRouteProp>();
        const { id } = route.params;
        const navigation = useNavigation();
        const dispatch = useDispatch();
        const favoriteCharacters = useSelector((state: any) => state.favoriteCharacters);

        useEffect(() => {
                const fetchData = async () => {
                        try {
                                const response = await fetch(`https://rickandmortyapi.com/api/episode/${id}`);
                                const responseData = await response.json();
                                setEpisodeData(responseData);

                                const characterPromises = responseData.characters.map((url: string) =>
                                        fetch(url).then(res => res.json())
                                );
                                const characterData = await Promise.all(characterPromises);
                                setCharacters(characterData);
                                setFilteredCharacters(characterData);
                        } catch (error) {
                                console.error('Error fetching data:', error);
                        } finally {
                                setLoading(false);
                        }
                };

                fetchData();
        }, [id]);

        const updateSearch = (text: string) => {
                setSearch(text);
                if (text) {
                        const newData = characters.filter(item => {
                                const itemData = `
                    ${item.name.toUpperCase()} 
                    ${item.status.toUpperCase()} 
                    ${item.species.toUpperCase()} 
                    ${item.gender.toUpperCase()}
                `;
                                const textData = text.toUpperCase();
                                return itemData.indexOf(textData) > -1;
                        });
                        setFilteredCharacters(newData);
                } else {
                        setFilteredCharacters(characters);
                }
        };

        // Pagination işlevselliği
        const onPageChange = (pageNumber: number) => {
                setCurrentPage(pageNumber);
        };

        const toggleFavorite = (characterId: string) => {
                const character = characters.find(char => char.id === characterId);
                if (!character) return;
                const isFavorite = favoriteCharacters.some((char: any) => char.id === characterId);
                if (isFavorite) {
                        dispatch(removeFavorite(character));
                } else {
                        dispatch(addFavorite(character));
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

        if (!episodeData) {
                return (
                        <SafeAreaView style={styles.errorContainer}>
                                <Text>Failed to load episode data.</Text>
                        </SafeAreaView>
                );
        }

        // Pagination bileşenine geçirilecek toplam sayfa sayısını belirleme
        const ITEMS_PER_PAGE = 10;
        const totalPages = Math.ceil(filteredCharacters.length / ITEMS_PER_PAGE);

        // Sayfaya göre filtrelenmiş karakter listesi
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredCharacters.length);
        const charactersOnPage = filteredCharacters.slice(startIndex, endIndex);

        return (
                <SafeAreaView style={styles.container}>
                        <ScrollView contentContainerStyle={styles.contentContainer}>
                                <View style={styles.stepContainer}>
                                        <Text style={styles.title}>{episodeData.name}</Text>
                                        <Text>Air Date: {episodeData.air_date}</Text>
                                        <Text>Episode: {episodeData.episode}</Text>
                                        <TextInput
                                                style={styles.searchBar}
                                                placeholder="Search Characters..."
                                                onChangeText={updateSearch}
                                                value={search}
                                        />
                                        <Text>Characters:</Text>
                                </View>
                                <View style={styles.characterGrid}>
                                        {charactersOnPage.map((character, index) => (
                                                <View key={character.id} style={styles.characterCardWrapper}>
                                                        <TouchableOpacity
                                                                style={styles.card}
                                                                onPress={() => navigation.navigate('Character', { characterId: character.id })}
                                                        >
                                                                <Image source={{ uri: character.image }} style={styles.characterImage} />
                                                                <View style={styles.characterInfo}>
                                                                        <Text style={styles.characterName}>{character.name}</Text>
                                                                        <Text style={styles.characterText}>Status: {character.status}</Text>
                                                                        <Text style={styles.characterText}>Species: {character.species}</Text>
                                                                        <Text style={styles.characterText}>Gender: {character.gender}</Text>
                                                                </View>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                                style={styles.favoriteButton}
                                                                onPress={() => toggleFavorite(character.id)}
                                                        >
                                                                {favoriteCharacters.some((char: any) => char.id === character.id) ?
                                                                        <Ionicons name="star" size={30} color="yellow" /> :
                                                                        <Ionicons name="star-outline" size={30} color="yellow" />
                                                                }
                                                        </TouchableOpacity>
                                                        {(index + 1) % 4 === 0 && <View style={styles.newRow} />}
                                                </View>
                                        ))}
                                </View>
                                {/* Pagination bileşenini ekleyin */}
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
                        </ScrollView>
                </SafeAreaView>
        );
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: '#f5f5f5',
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
        stepContainer: {
                padding: 16,
        },
        title: {
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 8,
        },
        searchBar: {
                height: 40,
                borderColor: '#ccc',
                borderWidth: 1,
                borderRadius: 8,
                paddingLeft: 8,
                marginVertical: 16,
        },
        contentContainer: {
                paddingHorizontal: 16,
        },
        characterGrid: {
                flexDirection: 'row',
                flexWrap: 'wrap',
        },
        characterCardWrapper: {
                width: '50%',
                position: 'relative', // Bunu ekleyin
        },
        card: {
                backgroundColor: '#fff',
                padding: 16,
                margin: 4,
                borderRadius: 8,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                height: 250,
                shadowRadius: 4,
                elevation: 2,
        },
        characterImage: {
                width: 100,
                height: 100,
                borderRadius: 50,
        },
        characterInfo: {
                alignItems: 'flex-start',
                marginLeft: 10,
        },
        characterName: {
                fontSize: 16,
                fontWeight: 'bold',
                marginTop: 8,
        },
        characterText: {
                textAlign: 'left',
        },
        newRow: {
                flexBasis: '100%',
                height: 0,
        },
        favoriteButton: {
                position: 'absolute', // Bunu ekleyin
                top: 10, // Kartın sağ üst köşesine yerleştirmek için
                right: 10, // Kartın sağ üst köşesine yerleştirmek için
                zIndex: 1, // Kartın üstünde olması için
        },
});
