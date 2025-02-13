import {StyleSheet, TouchableOpacity, View} from "react-native";
import {ThemeColors} from "@/assets/theme/colors";
import {SchoolResponse} from "@/types/school/school.types";
import {Text} from "@/components/Themed";
import React from "react";

interface SchoolProps {
  colors: ThemeColors;
  onPress: (school: SchoolResponse) => void;
  item: SchoolResponse
}

export default function School(props: SchoolProps) {
  return (
    <TouchableOpacity
      style={[styles.schoolItem, { borderBottomColor: props.colors.border }]}
      onPress={() => props.onPress(props.item)}
    >
      <View>
        <Text style={[styles.schoolName, { color: props.colors.text.primary }]}>
          {props.item.name}
        </Text>
        <Text style={[styles.schoolAddress, { color: props.colors.text.secondary }]}>
          {props.item.location}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  schoolItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  schoolAddress: {
    fontSize: 14,
  },
})