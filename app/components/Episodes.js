import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchData } from '../services/api';
import { useQuery } from '@tanstack/react-query';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Episodes = () => {
        const [page, setPage] = useState(1);
        const navigation = useNavigation();
        const handlePress = (id) => {
                navigation.navigate('Details', { id: id });
        };

        const { data, error, isLoading, refetch } = useQuery({
                queryKey: ['fetchData', page],
                queryFn: () => fetchData(page),
                keepPreviousData: true,
                enabled: true,
        });

        const handleNextPage = () => {
                setPage((prev) => prev + 1);
                refetch();
        };

        const handlePreviousPage = () => {
                setPage((prev) => Math.max(prev - 1, 1));
                refetch();
        };

        return (
                <View>
                        {isLoading ? (
                                <Text>Loading...</Text>
                        ) : data ? (
                                <View>
                                        <Image
                                                source={require('../../assets/images/rnm-header.png')}
                                                style={styles.headerimage}
                                        />

                                        <View style={styles.container}>
                                                {data.results.map((e, index) => (
                                                        <View key={e.id} style={styles.cardContainer}>
                                                                <TouchableOpacity onPress={() => handlePress(e.id)} style={styles.card}>
                                                                        <Image
                                                                                source={require('../../assets/images/rnm.jpg')}
                                                                                style={styles.image}
                                                                        />
                                                                        <Text style={styles.text}>{e.episode}: {e.name}</Text>
                                                                </TouchableOpacity>
                                                                {(index + 1) % 4 === 0 && <View style={styles.newRow} />}
                                                        </View>
                                                ))}
                                        </View>

                                        <View style={styles.paginationContainer}>
                                                {data.info.prev?.length > 0 && (
                                                        <TouchableOpacity onPress={handlePreviousPage} style={styles.paginationButton}>
                                                                <AntDesign name="leftcircleo" size={24} color="black" />
                                                                <Text style={styles.paginationButtonText}>Previous</Text>
                                                        </TouchableOpacity>
                                                )}

                                                {data.info.next?.length > 0 && (
                                                        <TouchableOpacity onPress={handleNextPage} style={styles.paginationButton}>
                                                                <Text style={styles.paginationButtonText}>Next</Text>
                                                                <AntDesign name="rightcircleo" size={24} color="black" />
                                                        </TouchableOpacity>
                                                )}

                                                {(!data.info.prev || data.info.prev?.length === 0) && (!data.info.next || data.info.next?.length === 0) && (
                                                        <TouchableOpacity onPress={handleNextPage} style={styles.paginationButton}>
                                                                <Text style={styles.paginationButtonText}>Next</Text>
                                                                <AntDesign name="rightcircleo" size={24} color="black" />
                                                        </TouchableOpacity>
                                                )}
                                        </View>
                                </View>
                        ) : (
                                <Text>No data available</Text>
                        )}
                </View>
        );
};

export default Episodes;

const styles = StyleSheet.create({
        container: {
                flexDirection: 'row',
                flexWrap: 'wrap',
        },
        cardContainer: {
                width: '32%',
                marginLeft: "1%",
                height: 250,
                marginBottom: 10,
        },
        card: {
                backgroundColor: '#fff',
                borderRadius: 10,
                alignItems: 'center',
                height: 240,
                padding: 8,
                marginBottom: 50,
        },
        image: {
                width: "100%",
                height: 160,
                marginBottom: 10,
        },
        headerimage: {
                width: "90%",
                marginLeft: "5%",
                height: 100,
                marginBottom: 10,
        },
        text: {
                textAlign: 'center',
        },
        newRow: {
                width: '100%',
        },
        paginationContainer: {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 10,
                paddingHorizontal: 20,
        },
        paginationButton: {
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 40,
        },
        paginationButtonText: {
                marginHorizontal: 5,
        },
        pageNumber: {
                fontSize: 16,
        },
        episodeTitle: {
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 10,
                textAlign: 'center',
        },
});
