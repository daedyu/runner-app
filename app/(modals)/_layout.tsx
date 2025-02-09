import { Stack } from 'expo-router';

export default function ModalsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                presentation: 'transparentModal',
                animation: 'slide_from_bottom',
                contentStyle: {
                    backgroundColor: 'transparent',
                },
            }}
        >
            <Stack.Screen 
                name="privacy-policy"
                options={{
                    animation: 'slide_from_bottom',
                }}
            />
        </Stack>
    )
}