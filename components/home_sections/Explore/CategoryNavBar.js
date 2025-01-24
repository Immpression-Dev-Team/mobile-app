import {
    View,
    ScrollView,
    StyleSheet,
} from "react-native";
import NavButton from "./NavButton";
import { useNavigation } from "@react-navigation/native";

export default function CategoryNavBar() {
    const navigation = useNavigation();
    const buttons = [
        { text: "PAINTINGS", link: 'Paintings' },
        { text: "PHOTOGRAPHY", link: 'Photography' },
        { text: "GRAPHIC DESIGN", link: 'Graphic Design' },
        { text: "ILLUSTRATIONS", link: 'Illustrations' },
        { text: "SCULPTURES", link: 'Sculptures' },
        // { text: "Woodwork", link: 'Woodwork' },
        // { text: "Graffiti", link: 'Graffiti' },
        // { text: "Stencil", link: 'Stencil' },
    ]

    // navigate to individual category screen
    const handleOpenCategory = (item) => {
        navigation.navigate('Category', {category: item?.link});
    }

    return(
        <View style={styles.navContainer}>
            <ScrollView
                horizontal
                style={styles.scrollView}
                showsHorizontalScrollIndicator={false}
            >
                {
                    buttons.map((item, index) => (
                        <NavButton
                            key={index}
                            btnText={item.text}
                            handler={() => handleOpenCategory(item)}
                        />
                    ))
                }
            </ScrollView>     
        </View>
    )
}

const styles = StyleSheet.create({
    navContainer: {
        width: '100%',
        flexDirection: 'row',
        alignContent: 'center',
        paddingHorizontal: 5,
    },
    scrollView: {
        flex: 1,
    },
});