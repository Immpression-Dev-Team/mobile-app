import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../components/Navbar";
import FooterNavbar from "../components/FooterNavbar";

import Paintings from '../assets/categories/Paintings.jpg';
import Photography from '../assets/categories/Photography.jpg';
import Graphic from '../assets/categories/Graphic Design.jpg';
import Illustrations from '../assets/categories/Illustrations.jpg';
import Sculptures from '../assets/categories/Sculptures.jpg';
import Woodwork from '../assets/categories/Woodwork.jpg';
import Graffiti from '../assets/categories/Graffiti.jpg';
import Stencil from '../assets/categories/Stencil.jpg';

export default function CategoriesScreen() {
    const navigation = useNavigation();

    // tbd - these links are for useNav in utils
    const images = [
        { text: "Paintings", img: Paintings, link: 'Paintings' },
        { text: "Photography", img: Photography, link: 'Photography' },
        { text: "Graphic Design", img: Graphic, link: 'GraphicDesign' },
        { text: "Illustrations", img: Illustrations, link: 'Illustrations' },
        { text: "Sculptures", img: Sculptures, link: 'Sculptures' },
        { text: "Woodwork", img: Woodwork, link: 'Woodwork' },
        { text: "Graffiti", img: Graffiti, link: 'Graffiti' },
        { text: "Stencil", img: Stencil, link: 'Stencil' },
    ]

    return(
        <View style={styles.container}>
            <ImageBackground
          source={require("../assets/backgrounds/navbar_bg_blue.png")} // Replace with your image path
          style={styles.navbarBackgroundImage}
        >  
          <Navbar />
        </ImageBackground>
            <View style={styles.content}>
                <Text style={styles.title}>Categories</Text>
                <View style={styles.categoriesContainer}>
                    {
                        images.map((item, index) => (
                            <TouchableOpacity
                                key={index} style={styles.category}
                                onPress={() => navigation.navigate(item.link)}
                            >
                                <>
                                    <Image source={item.img} style={styles.image}/>
                                    <Text style={styles.label}>{item.text}</Text>
                                </>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </View>
            <FooterNavbar/>
        </View>
    )
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
    content: {
        flex: 1,
        flexDirection: 'column',
        paddingVertical: '2.5%',
        paddingHorizontal: '1.25%',
    },
    title: {
        marginLeft: '1.75%',
        fontSize: 25,
        fontFamily: 'LEMON MILK Bold',
    },
    categoriesContainer: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: '2%',
    },
    category: {
        width: '50%',
        height: '23.55%',
        padding: '1%',
        marginVertical: '0.75%',
    },
    image: {
        width: '100%',
        height: '77.5%',
    },
    label: {
        marginTop: '1.5%',
        fontSize: 12.5,
        fontFamily: 'LEMON MILK Bold',
        textAlign: 'center',
    }
})