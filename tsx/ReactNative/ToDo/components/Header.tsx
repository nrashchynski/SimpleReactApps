import { Text, StyleSheet, View } from "react-native"
import { useMemo } from "react"

import { useTheme } from "../context/ThemeContext"
import type { ThemeColors } from "../theme/colors"

export default function Header() {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return(
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>ToDo List</Text>
        </View>
    )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems:"flex-start",
        paddingLeft: 12,
        paddingTop: 35,
        paddingBottom: 15,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "left",
        color: colors.text,
    }
})
