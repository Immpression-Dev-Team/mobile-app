import React from "react";
import {
    View,
    StyleSheet,
} from "react-native";

export default function SectionTemplate({renderSection, height, marginHeight}) {
    return(
        <View
            style={[
                styles.sectionContainer, { height: `${height}%` }
            ]}
        >
            {/* render section content */}
            <View style={[
                styles.viewContainer, { marginVertical : `${marginHeight}%` }
            ]}>
                {
                    renderSection
                }
            </View>
        </View>
    )
}
  
const styles = StyleSheet.create({
    sectionContainer: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
    viewContainer: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: 'center',
    },
})