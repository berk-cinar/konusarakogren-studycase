import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Episodes from "../components/Episodes"
import { ScrollView } from 'react-native-gesture-handler';

const Homepage = () => {
        return (
                <SafeAreaView>
                        <ScrollView>
                                <Episodes />
                        </ScrollView>

                </SafeAreaView>
        )
}

export default Homepage
