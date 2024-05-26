import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
        const [visiblePages, setVisiblePages] = useState([]);

        useEffect(() => {
                updateVisiblePages();
        }, [currentPage, totalPages]);

        const updateVisiblePages = () => {
                let startPage = Math.max(1, currentPage - 1);
                let endPage = Math.min(totalPages, currentPage + 1);

                if (totalPages <= 3) {
                        startPage = 1;
                        endPage = totalPages;
                } else {
                        if (currentPage === 1) {
                                endPage = 3;
                        } else if (currentPage === totalPages) {
                                startPage = totalPages - 2;
                        }
                }

                const updatedPages = [];
                for (let i = startPage; i <= endPage; i++) {
                        updatedPages.push(i);
                }
                setVisiblePages(updatedPages);
        };

        const handlePrevious = () => {
                if (currentPage > 1) {
                        onPageChange(currentPage - 1);
                }
        };

        const handleNext = () => {
                if (currentPage < totalPages) {
                        onPageChange(currentPage + 1);
                }
        };

        const handlePageClick = (pageNumber) => {
                onPageChange(pageNumber);
        };

        return (
                <View style={styles.container}>
                        <TouchableOpacity onPress={handlePrevious} disabled={currentPage === 1}>
                                <AntDesign name="leftcircleo" size={24} color={currentPage === 1 ? 'gray' : 'black'} />
                        </TouchableOpacity>
                        {visiblePages.map(pageNumber => (
                                <TouchableOpacity key={pageNumber} onPress={() => handlePageClick(pageNumber)}>
                                        <Text style={pageNumber === currentPage ? styles.activePage : styles.page}>{pageNumber}</Text>
                                </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={handleNext} disabled={currentPage === totalPages}>
                                <AntDesign name="rightcircleo" size={24} color={currentPage === totalPages ? 'gray' : 'black'} />
                        </TouchableOpacity>
                </View>
        );
};

const styles = StyleSheet.create({
        container: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
        },
        page: {
                marginHorizontal: 5,
        },
        activePage: {
                marginHorizontal: 5,
                fontWeight: 'bold',
        },
});

export default Pagination;
