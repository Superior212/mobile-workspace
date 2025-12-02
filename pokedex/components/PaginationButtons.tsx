import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface PaginationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  loading?: boolean;
  previousLabel?: string;
  nextLabel?: string;
}

export default function PaginationButtons({
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  loading = false,
  previousLabel = "Previous",
  nextLabel = "Next",
}: PaginationButtonsProps) {
  const isPreviousDisabled = !hasPrevious || loading;
  const isNextDisabled = !hasNext || loading;

  return (
    <View style={styles.paginationContainer}>
      <Pressable
        onPress={onPrevious}
        disabled={isPreviousDisabled}
        style={[
          styles.paginationButton,
          isPreviousDisabled && styles.paginationButtonDisabled,
        ]}>
        <Text
          style={[
            styles.paginationButtonText,
            isPreviousDisabled && styles.paginationButtonTextDisabled,
          ]}>
          {previousLabel}
        </Text>
      </Pressable>
      <Pressable
        onPress={onNext}
        disabled={isNextDisabled}
        style={[
          styles.paginationButton,
          isNextDisabled && styles.paginationButtonDisabled,
        ]}>
        <Text
          style={[
            styles.paginationButtonText,
            isNextDisabled && styles.paginationButtonTextDisabled,
          ]}>
          {nextLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#16213e",
    borderTopWidth: 1,
    borderTopColor: "#1a1a2e",
  },
  paginationButton: {
    flex: 1,
    backgroundColor: "#c5931dff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  paginationButtonDisabled: {
    backgroundColor: "#3a3a4e",
    opacity: 0.5,
  },
  paginationButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  paginationButtonTextDisabled: {
    color: "#a0a0a0",
  },
});
