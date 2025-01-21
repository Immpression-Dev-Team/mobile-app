import {
    StyleSheet,
    View,
    Text,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import NoContent from "../NoContent";
import CategoryLayout from "./CategoryLayout";

// renders either 8 categories / an empty content view / all artworks within a selected category
export default function CategoryContent({title, images}){
    const route = useRoute();
    const categorySelected = route.params?.category;
    const navigation = useNavigation();

    // navigate to individual category screen
    const handleOpenCategory = (item) => {
        navigation.navigate('Category', {category: item?.link});
    }

    // navigate to individual image screen
    const handleOpenArt = (index) => {
        navigation.navigate('ImageScreen', { images, initialIndex: index });
    };

    // handler to decide where to navigate
    const handleOnPress = (item, index) => {
        if(categorySelected){
            handleOpenArt(index);
        }
        else{
            handleOpenCategory(item);
        }
    }

    return(
        <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            {
                (!images || images.length === 0) ?
                    <NoContent size='large'/> :
                    <CategoryLayout
                        images={images}
                        categorySelected={categorySelected}
                        handler={handleOnPress}
                    />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingVertical: '2.5%',
        paddingHorizontal: '1.25%',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    title: {
        marginLeft: '1.75%',
        fontSize: 25,
        fontFamily: 'LEMON MILK Bold',
    },
})