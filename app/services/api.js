import axios from 'axios';

const API_BASE_URL = 'https://rickandmortyapi.com/api/episode';

export const fetchData = async (page) => {
        try {
                const response = await axios.get(`${API_BASE_URL}?page=${page}`);
                return response.data;
        } catch (error) {
                console.error('Error fetching data:', error);
                throw error;
        }
};

export const fetchDetail = async (id) => {
        try {
                const response = await axios.get(`${API_BASE_URL}/${id}`);
                return response;
        } catch (error) {
                console.error('Error fetching data:', error);
                throw error;
        }
};
