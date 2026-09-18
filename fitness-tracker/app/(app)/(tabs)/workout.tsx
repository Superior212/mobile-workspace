import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

const Workout = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">Workout</Text>
    </SafeAreaView>
  );
};

export default Workout;
