import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Alert } from 'react-native';

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

const favoriteCharactersSlice = createSlice({
        name: 'favoriteCharacters',
        initialState: [] as Character[],
        reducers: {
                addFavorite: (state, action: PayloadAction<Character>) => {
                        if (state.length < 10) {
                                state.push(action.payload);
                        } else {
                                Alert.alert("Limit Reached", "You can't add more than 10 favorite characters!");
                        }
                },
                removeFavorite: (state, action: PayloadAction<Character>) => {
                        return state.filter(character => character.id !== action.payload.id);
                },
        },
});

export const { addFavorite, removeFavorite } = favoriteCharactersSlice.actions;
export default favoriteCharactersSlice.reducer;
