import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Pokemon {
  name: string;
  url: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
  colorByType: string;
  id: number;
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

const colorByType: Record<string, string> = {
  grass: "#78C850",
  fire: "#F08030",
  water: "#6890F0",
  bug: "#A8B820",
  normal: "#A8A878",
  poison: "#A040A0",
  electric: "#F8D030",
  ground: "#E0C068",
  fairy: "#EE99AC",
};

export default function Index() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>(
    "https://pokeapi.co/api/v2/pokemon/?limit=100"
  );
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);

  const getPokemon = async (urlToFetch?: string | null) => {
    const fetchUrl = urlToFetch || nextUrl;
    if (!fetchUrl || loading) return;

    // Check if we've reached the 100 Pokemon limit
    const urlParams = new URLSearchParams(fetchUrl.split("?")[1]);
    const offset = parseInt(urlParams.get("offset") || "0", 10);
    if (offset >= 100) {
      setNextUrl(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(fetchUrl);
      const data = await response.json();

      // Check if next URL would exceed 100 Pokemon limit
      let next = data.next;
      if (next) {
        const nextParams = new URLSearchParams(next.split("?")[1]);
        const nextOffset = parseInt(nextParams.get("offset") || "0", 10);
        if (nextOffset >= 100) {
          next = null;
        }
      }

      // Update next and previous URLs for pagination
      setNextUrl(next);
      setPreviousUrl(data.previous);

      // Fetch detailed info for each Pokemon
      const detailedInfo = await Promise.all(
        data.results.map(async (poke: Pokemon) => {
          const res = await fetch(poke.url);
          const details = await res.json();
          return {
            name: poke.name,
            url: poke.url,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            types: details.types,
            colorByType: colorByType[details.types[0].type.name] || "#A8A878",
            id: details.id,
          };
        })
      );

      setPokemon(detailedInfo);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialUrl = "https://pokeapi.co/api/v2/pokemon/?limit=10&offset=0";
    getPokemon(initialUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNextPage = () => {
    if (nextUrl && !loading) {
      getPokemon(nextUrl);
    }
  };

  const handlePreviousPage = () => {
    if (previousUrl && !loading) {
      getPokemon(previousUrl);
    }
  };

  // Render skeleton loading card
  const SkeletonCard = ({ index }: { index: number }) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.7,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }, [opacity]);

    return (
      <View style={[styles.card, styles.skeletonCard]}>
        <View style={styles.cardGradient}>
          <View style={styles.imageContainer}>
            <Animated.View style={[styles.skeletonImage, { opacity }]} />
          </View>
          <View style={styles.skeletonTextContainer}>
            <Animated.View style={[styles.skeletonText, { opacity }]} />
            <Animated.View
              style={[
                styles.skeletonText,
                { width: 60, marginTop: 8, opacity },
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderSkeletonCard = ({ index }: { index: number }) => (
    <SkeletonCard index={index} />
  );

  // Render single Pokémon card
  const renderPokemonCard = ({ item: poke }: { item: Pokemon }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/details",
          params: { name: poke.name },
        })
      }
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: poke.colorByType + 20, // Semi-transparent type color
          borderColor: poke.colorByType + 50,
          transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
        },
      ]}>
      <View style={styles.cardGradient}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: poke.image }} style={styles.pokeImage} />
        </View>
        <View>
          <Text style={styles.pokeName}>{poke.name.toUpperCase()}</Text>
          <Text style={styles.pokeId}>{String(poke.id).padStart(3, "0")}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#c5931dff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pokédex</Text>
        <Text style={styles.subtitle}>Discover Pokémon</Text>
      </View>
      <FlatList
        data={loading ? Array(10).fill(null) : pokemon}
        renderItem={({ item, index }) =>
          loading
            ? renderSkeletonCard({ index })
            : renderPokemonCard({ item: item as Pokemon })
        }
        keyExtractor={(_, index) => `item-${index}`}
        numColumns={2} // Two columns per row
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.rowWrapper} // Styles for each row of two cards
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />} // Vertical spacing between rows
        ListFooterComponent={() => <View style={{ height: 20 }} />}
      />
      {/* Pagination Buttons */}
      <View style={styles.paginationContainer}>
        <Pressable
          onPress={handlePreviousPage}
          disabled={!previousUrl || loading}
          style={[
            styles.paginationButton,
            (!previousUrl || loading) && styles.paginationButtonDisabled,
          ]}>
          <Text
            style={[
              styles.paginationButtonText,
              (!previousUrl || loading) && styles.paginationButtonTextDisabled,
            ]}>
            Previous
          </Text>
        </Pressable>
        <Pressable
          onPress={handleNextPage}
          disabled={!nextUrl || loading}
          style={[
            styles.paginationButton,
            (!nextUrl || loading) && styles.paginationButtonDisabled,
          ]}>
          <Text
            style={[
              styles.paginationButtonText,
              (!nextUrl || loading) && styles.paginationButtonTextDisabled,
            ]}>
            Next
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#16213e",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#a0a0a0",
    marginTop: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  rowWrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: "solid",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    maxWidth: Dimensions.get("window").width / 2 - 32,
  },
  cardGradient: {
    padding: 16,
    minHeight: 240,
  },

  pokeName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#cfe9ef",
    textTransform: "capitalize",
    letterSpacing: 1.0,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    textAlign: "center",
  },
  pokeId: {
    fontSize: 16,
    fontWeight: "400",
    color: "#cfe9ef",
    textAlign: "center",
    letterSpacing: 1.2,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  typeBadgeContainer: {
    marginTop: 6,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
  },
  typeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  imageContainer: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  pokeImage: {
    width: 140,
    height: 140,
    resizeMode: "cover",
  },
  cardFooter: {
    alignItems: "center",
  },
  discoverText: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.8,
    fontStyle: "italic",
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingText: {
    color: "#a0a0a0",
    fontSize: 14,
  },
  skeletonCard: {
    backgroundColor: "#2a2a3e",
    borderColor: "#3a3a4e",
  },
  skeletonImage: {
    width: 140,
    height: 140,
    backgroundColor: "#3a3a4e",
    borderRadius: 8,
  },
  skeletonTextContainer: {
    alignItems: "center",
    width: "100%",
  },
  skeletonText: {
    height: 16,
    width: 100,
    backgroundColor: "#3a3a4e",
    borderRadius: 4,
  },
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
