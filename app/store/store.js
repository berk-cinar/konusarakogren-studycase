import { configureStore } from '@reduxjs/toolkit';
import favoriteCharactersReducer from './reducers/favoriteCharactersSlice';

const store = configureStore({
        reducer: {
                favoriteCharacters: favoriteCharactersReducer,
        }
});

export default store;
