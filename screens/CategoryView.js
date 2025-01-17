import {
    StyleSheet,
    Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";

import { getAllImages } from "../API/API";
import { useAuth } from "../state/AuthProvider";
import { showToast } from "../utils/toastNotification";

import CategoryContent from "../components/category_sections/CategoryContent";
import ScreenTemplate from "./ScreenTemplate";

export default function CategoryView() {
    const { token } = useAuth();
    
    const route = useRoute();
    const { category } = route.params;

    const [categoryArts, setCategoryArts] = useState([]);

    const fetchCategory = async (token) => {
        try{
            // sort images by their created time once fetched
            const response = await getAllImages(token, category);
            if (response.success) {
                const sortedImages = response.images?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setCategoryArts(sortedImages);
            } else {
                showToast(response.data?.error || 'Error getting art data');
            }
        }
        catch(error){
            showToast('Error fetching category arts');
        }
    }

    // fetch all images from a specific category every time land page
    useEffect(() => {
        if(token){
            fetchCategory(token);
        }
    }, [])

    return(
        <ScreenTemplate>
            <CategoryContent
                title={category}
                images={categoryArts}
            />
        </ScreenTemplate>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
    footer: {
        width: "100%",
        height: (Platform.OS === 'web') ? "10%" : "8%",
        zIndex: 1000,
    },
})