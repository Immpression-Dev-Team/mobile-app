import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function NoContent({size}){
    const navigation = useNavigation();
    const isMediumSize = (size === "medium");

    console.log(size);
    console.log(isMediumSize);
    
    return(
        <View style={styles.noContent}>
            <Text style={isMediumSize ? styles.warningIcon : styles.largeWarningIcon}>
                !
            </Text>
            <Text style={isMediumSize ? styles.warningMsg : styles.largeWarningMsg}>
                No images yet
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Upload')}
            >
                <Text style={styles.buttonText}>UPLOAD NOW</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    noContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    warningIcon:{
        fontSize: 90,
        color: '#969696',
    },
    largeWarningIcon:{
        fontSize: 127.5,
        color: '#969696',
    },
    warningMsg:{
        fontSize: 15,
        fontFamily: 'LEMON MILK Bold',
        color: '#969696',
    },
    largeWarningMsg:{
        fontSize: 22.5,
        fontFamily: 'LEMON MILK Bold',
        color: '#969696',
    },
    button: {
        marginVertical: '7.5%',
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginHorizontal: 5,
        borderRadius: 6,
        backgroundColor: '#969696',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '600',
        color: 'white',
    },
});

// import {
//     StyleSheet,
//     View,
//     Text,
//     TouchableOpacity,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";

// export default function NoContent(height=null){
//     const navigation = useNavigation();
    
//     return(
//         <View style={[
//             styles.noContentContainer, (height)? {height: `${height}%`} : {flex: 1}
//         ]}>
//             <Text style={styles.warningIcon}>!</Text>
//             <Text style={styles.warningMsg}>No images yet</Text>
//             <TouchableOpacity
//                 style={styles.button}
//                 onPress={() => navigation.navigate('Upload')}
//             >
//                 <Text style={styles.buttonText}>UPLOAD NOW</Text>
//             </TouchableOpacity>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     noContentContainer: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     warningIcon:{
//         fontSize: 127.5,
//         color: '#969696',
//     },
//     warningMsg:{
//         fontSize: 22.5,
//         fontFamily: 'LEMON MILK Bold',
//         color: '#969696',
//     },
//     button: {
//         marginVertical: '7.5%',
//         paddingVertical: 10,
//         paddingHorizontal: 30,
//         marginHorizontal: 5,
//         borderRadius: 6,
//         backgroundColor: '#969696',
//     },
//     buttonText: {
//         fontSize: 15,
//         fontWeight: '600',
//         color: 'white',
//     },
// })