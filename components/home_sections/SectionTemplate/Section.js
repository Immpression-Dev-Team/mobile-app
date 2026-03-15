import React from "react";
import {
    View,
    StyleSheet,
} from "react-native";

export default function SectionTemplate({renderSection}) {
    return(
        <View style={styles.sectionContainer}>
            <View style={styles.viewContainer}>
                {renderSection}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
        width: '100%',
        backgroundColor: 'white',
    },
    viewContainer: {
        width: "100%",
    },
})