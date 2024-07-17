import { Image, StyleSheet, Text, Pressable, View } from "react-native";

const SettingsItem = ({ item: { iconUrl, label }, handleClick }) => {
    return (
        <Pressable style={styles.container} onPress={handleClick}>
            <View style={styles.settingImgContainer}>
                <Image style={styles.settingImg} source={iconUrl} resizeMethod="contain" />
            </View>
            <Text style={styles.settingLabel}>{label}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    settingImgContainer: {
        width: 24,  // Reduced size
        height: 24, // Reduced size
    },
    settingImg: {
        width: '100%',
        height: '100%',
    },
    settingLabel: {
        fontSize: 18, // Reduced size
    },
});

export default SettingsItem;
