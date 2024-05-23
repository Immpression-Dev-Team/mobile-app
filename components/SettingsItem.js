import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";

const SettingsItem = ({item: { iconUrl, label}, handleClick }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={handleClick}>
            <View style={styles.settingImgContainer}>
                <Image style={styles.settingImg} source={iconUrl} resizeMethod="contain" />
            </View>
            <Text style={styles.settingLabel}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    settingImgContainer: {
      width: 40,
      height: 40,
    },
    settingImg: {
        width: '100%',
        height: '100%'
    },
    settingLabel: {
        fontSize: 28,
    }
})

export default SettingsItem;