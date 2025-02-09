import {Stack} from "expo-router";

export default function ModalLayout() {
    return (
        <Stack
            screenOptions={{
                presentation: 'modal',
                animation: 'fade',
            }}
        >
            <Stack.Screen name="privacy-policy"/>
        </Stack>
    )
}