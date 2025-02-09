import {Dimensions, StyleSheet, View} from "react-native";
import {ThemeColors} from "@/assets/theme/colors";
import {Text} from "@/components/Themed";
import React from "react";
import * as Progress from 'react-native-progress';

interface StatBarProps {
    title: string;
    colors: ThemeColors;
    currentData: number;
    targetData: number;
    isLoading: boolean;
    unit: string;
}

const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const min = minutes % 60;
    if (hours > 0) {
        return `${hours}시간 ${min}분`;
    }
    return `${min}분`;
};

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function StatBar({title, colors, currentData, targetData, isLoading, unit}: StatBarProps) {
    const progress = isLoading ? 0 : currentData / targetData;
    const formatData = (data: number) => (unit === "time" ? formatTime(data) : `${data}${unit}`);


    return (
        <View>
            <Text style={[styles.cardTitle, { color: colors.text.primary }]}>{ title }</Text>
            <View style={styles.progressContainer}>
                <Progress.Bar
                    progress={isLoading ? 0 : progress}
                    width={SCREEN_WIDTH - 112}
                    height={15}
                    color={colors.progress.fill}
                    unfilledColor={colors.progress.background}
                    borderWidth={0}
                    animated={true}
                />
            </View>
            <View style={styles.statsInfo}>
                {isLoading ? (
                    <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                        로딩 중...
                    </Text>
                ) : (
                    <>
                        <Text style={[styles.currentValue, { color: colors.text.primary }]}>
                            {formatData(currentData)}
                        </Text>
                        <Text style={[styles.targetValue, { color: colors.text.secondary }]}>
                            / {formatData(targetData)}
                        </Text>
                    </>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    progressContainer: {
        width: '100%',
    },
    statsInfo: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    loadingText: {
        fontSize: 16,
        fontWeight: '500',
    },
    currentValue: {
        fontSize: 18,
        fontWeight: '600',
    },
    targetValue: {
        fontSize: 11,
        marginLeft: 4,
    },
})