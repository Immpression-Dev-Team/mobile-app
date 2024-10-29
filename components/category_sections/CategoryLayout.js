import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList
} from "react-native";

// render images in grid layout
export default function CategoryLayout({images, categorySelected, handler}){
    // render image w/ or w/o text
    const renderImage = (item) => {
        const imgSrc = (categorySelected) ? { uri: item.imageLink } : item.img

        return(
            (categorySelected) ?
                <Image source={imgSrc} style={styles.artImage}/> :
                <>
                    <Image source={imgSrc} style={styles.categoryImage}/>
                    <Text style={styles.label}>{item.text}</Text>
                </>
        )
    }

    // render individual art or category type cover
    const renderItem = (item, index) => {
        const artStyle = {
            flex: 1,
            padding: '1%',
            maxWidth: (index == images.length-1) ? '50%' : '100%',
        };
        const btnStyle = categorySelected ? artStyle : styles.category;

        return(
            <TouchableOpacity
                key={index}
                style={btnStyle}
                onPress={() => handler(item, index)}
            >
                { renderImage(item) }
            </TouchableOpacity>
        )
    };

    return(
        (categorySelected) ?
            <FlatList
                data={images}
                numColumns={3}
                style={styles.flatlist}
                renderItem={({item, index}) => renderItem(item, index)}
            /> :
            <View style={styles.container}>
                {
                    images?.map((item, index) => renderItem(item, index))
                }
            </View>
    );
}


const styles = StyleSheet.create({
    flatlist: {
        marginTop: '2%',
    },
    container: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        paddingVertical: '2%',
    },
    category: {
        width: '50%',
        height: '23.55%',
        padding: '1%',
        marginVertical: '0.75%',
    },
    categoryImage: {
        width: '100%',
        height: '77.5%',
    },
    label: {
        marginTop: '1.5%',
        fontSize: 12.5,
        fontFamily: 'LEMON MILK Bold',
        textAlign: 'center',
    },
    artImage: {
        width: '100%',
        height: 125,
        resizeMode: 'cover',
    },
})