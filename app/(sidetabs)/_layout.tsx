import {Stack} from "expo-router";

export default function SideTabsLayout() {
    return (
        <Stack screenOptions=
            {{ headerShown: false }}
        >
            <Stack.Screen name="stats"/>
            <Stack.Screen name="running"/>
            <Stack.Screen name="edit"/>
            <Stack.Screen name="settings"/>
        </Stack>
    )
}