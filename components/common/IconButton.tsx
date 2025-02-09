import {StyleSheet, TouchableOpacity} from "react-native";
import React from "react";
import {ThemeColors} from "@/assets/theme/colors";
import {Ionicons} from "@expo/vector-icons";
import {Text} from "@/components/Themed";

interface IconButtonProps {
    icons: any;
    colors: ThemeColors;
    onPress?: () => void;
    disabled?: boolean;
    buttonText: string;

}

export default function IconButton(props: IconButtonProps) {
    return (
        <TouchableOpacity style={[
            styles.button,
            {
                opacity: props.disabled ? 0.7 : 1,
                backgroundColor: props.colors.primary,
            }
        ]}
        onPress={props.onPress}
        disabled={props.disabled}
        >
            <Ionicons name={props.icons} size={24} color={props.colors.text.inverse} />
            <Text style={[styles.buttonText, { color: props.colors.text.inverse }]}>{props.buttonText}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        height: '100%',
    },
})