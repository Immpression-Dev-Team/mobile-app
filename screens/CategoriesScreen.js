import {
    StyleSheet,
    Platform,
} from "react-native";
import CategoryContent from "../components/category_sections/CategoryContent";
import ScreenTemplate from "./Template/ScreenTemplate";

import Paintings from '../assets/categories/Paintings.jpg';
import Photography from '../assets/categories/Photography.jpg';
import Graphic from '../assets/categories/Graphic Design.jpg';
import Illustrations from '../assets/categories/Illustrations.jpg';
import Sculptures from '../assets/categories/Sculptures.jpg';
import Woodwork from '../assets/categories/Woodwork.jpg';
import Graffiti from '../assets/categories/Graffiti.jpg';
import Stencil from '../assets/categories/Stencil.jpg';

export default function CategoriesScreen() {
    // links will redirect app to visit different categories
    const images = [
        { text: "Paintings", img: Paintings, link: 'Paintings' },
        { text: "Photography", img: Photography, link: 'Photography' },
        { text: "Graphic Design", img: Graphic, link: 'Graphic Design' },
        { text: "Illustrations", img: Illustrations, link: 'Illustrations' },
        { text: "Sculptures", img: Sculptures, link: 'Sculptures' },
        { text: "Woodwork", img: Woodwork, link: 'Woodwork' },
        { text: "Graffiti", img: Graffiti, link: 'Graffiti' },
        { text: "Stencil", img: Stencil, link: 'Stencil' },
    ]

    return(
        <ScreenTemplate>
            <CategoryContent
                title='Categories'
                images={images}
            />
        </ScreenTemplate>
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
    footer: {
        width: "100%",
        height: (Platform.OS === 'web') ? "10%" : "8%",
        zIndex: 1000,
    },
})