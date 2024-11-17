import {
    StyleSheet,
    View,
    ImageBackground,
} from "react-native";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";

import { getAllImages } from "../API/API";
import { useAuth } from "../state/AuthProvider";
import { showToast } from "../utils/toastNotification";

import Navbar from "../components/Navbar";
import FooterNavbar from "../components/FooterNavbar";
import CategoryContent from "../components/category_sections/CategoryContent";

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
        <View style={styles.container}>
            <ImageBackground
                source={require("../assets/backgrounds/navbar_bg_blue.png")} // Replace with your image path
                style={styles.navbarBackgroundImage}
            >
                <Navbar />
            </ImageBackground>
            <CategoryContent
                title={category}
                images={categoryArts}
            />
            <FooterNavbar/>
        </View>
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
})