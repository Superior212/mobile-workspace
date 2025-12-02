import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface PokemonMove {
  move: {
    name: string;
  };
}

interface PokemonAbility {
  ability: {
    name: string;
  };
  is_hidden: boolean;
}

interface PokemonType {
  type: {
    name: string;
  };
}

interface Pokemon {
  name: string;
  id: number;
  image: string;
  types: PokemonType[];
  height: number;
  weight: number;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  moves: PokemonMove[];
}

const Details = () => {
  const params = useLocalSearchParams();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.name) return;

    async function getPokemon() {
      setLoading(true);
      setError(null);
      try {
        const url = `https://pokeapi.co/api/v2/pokemon/${params.name}`;
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`Failed to fetch: ${response.status}`);

        const data = await response.json();

        const detailedInfo: Pokemon = {
          name: data.name,
          id: data.id,
          image: data.sprites.front_default || "",
          types: data.types,
          height: data.height,
          weight: data.weight,
          abilities: data.abilities,
          stats: data.stats,
          moves: data.moves.slice(0, 20),
        };
        setPokemon(detailedInfo);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    getPokemon();
  }, [params.name]);

  if (loading)
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  if (error || !pokemon)
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );

  // Helper: Get type color
  const getTypeColor = (typeName: string) => {
    const colors: { [key: string]: string } = {
      grass: "#78C850",
      poison: "#A040A0",
      normal: "#A8A878",
      fire: "#F08030",
      water: "#6890F0",
      electric: "#F8D030",
      ice: "#98D8D8",
      fighting: "#C03028",
      ground: "#E0C068",
      flying: "#A890F0",
      psychic: "#F85888",
      bug: "#A8B820",
      rock: "#B8A038",
      ghost: "#705898",
      dragon: "#7038F8",
      dark: "#705848",
      steel: "#B8B8D0",
      fairy: "#EE99AC",
    };
    return colors[typeName] || "#A0A0A0";
  };

  // Helper: Format height/weight
  const formatHeight = (height: number) => `${height / 10}m`;
  const formatWeight = (weight: number) => `${weight / 10}kg`;

  // Render stat bar
  const renderStatBar = (item: PokemonStat, index: number) => (
    <View key={`stat-${index}`} style={styles.statRow}>
      <Text style={styles.statLabel}>{item.stat.name.toUpperCase()}</Text>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.bar,
            {
              width: `${Math.min((item.base_stat / 255) * 100, 100)}%`,
              backgroundColor: getTypeColor(
                pokemon.types[0]?.type.name || "normal"
              ),
            },
          ]}
        />
        <Text style={styles.statValue}>{item.base_stat}</Text>
      </View>
    </View>
  );

  // Render move item
  const renderMove = (item: PokemonMove, index: number) => (
    <View key={`move-${index}`} style={styles.moveItem}>
      <Text style={styles.moveText}>{item.move.name.replace("-", " ")}</Text>
    </View>
  );

  // Render ability item
  const renderAbility = (item: PokemonAbility, index: number) => (
    <View key={`ability-${index}`} style={styles.abilityItem}>
      <Text style={styles.abilityText}>
        {item.ability.name.replace("-", " ")}
        {item.is_hidden ? " (Hidden)" : ""}
      </Text>
    </View>
  );

  // Render type badge
  const renderTypeBadge = (type: PokemonType, index: number) => (
    <View
      key={`type-${index}`}
      style={[
        styles.typeBadge,
        { backgroundColor: getTypeColor(type.type.name) },
      ]}>
      <Text style={styles.typeBadgeText}>{type.type.name.toUpperCase()}</Text>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <Text style={styles.pokeId}>
          #{pokemon.id.toString().padStart(3, "0")}
        </Text>
        <Text style={styles.pokeName}>{pokemon.name.toUpperCase()}</Text>
        <View
          style={[
            styles.imageContainer,
            {
              backgroundColor:
                getTypeColor(pokemon.types[0]?.type.name || "normal") + "40",
            },
          ]}>
          <Image source={{ uri: pokemon.image }} style={styles.pokeImage} />
        </View>
        <View style={styles.typesContainer}>
          {pokemon.types.map(renderTypeBadge)}
        </View>
      </View>

      {/* Physical Stats Card */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Physical Stats</Text>
        <View style={styles.physicalRow}>
          <View style={styles.physicalItem}>
            <Text style={styles.physicalLabel}>Height</Text>
            <Text style={styles.physicalValue}>
              {formatHeight(pokemon.height)}
            </Text>
          </View>
          <View style={styles.physicalItem}>
            <Text style={styles.physicalLabel}>Weight</Text>
            <Text style={styles.physicalValue}>
              {formatWeight(pokemon.weight)}
            </Text>
          </View>
        </View>
      </View>

      {/* Abilities Card */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Abilities</Text>
        <View>
          {pokemon.abilities.map((ability, index) =>
            renderAbility(ability, index)
          )}
        </View>
      </View>

      {/* Stats Card */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Base Stats</Text>
        <View>
          {pokemon.stats.map((stat, index) => renderStatBar(stat, index))}
        </View>
      </View>

      {/* Moves Card */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Moves (Top 20)</Text>
        <View style={styles.movesGrid}>
          {pokemon.moves.map((move, index) => renderMove(move, index))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Details;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    gap: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    color: "#d32f2f",
  },
  // Header Card
  headerCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pokeId: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  pokeName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    paddingVertical: 20,
    backgroundColor: "#E8F5E9",
    borderRadius: 16,
  },
  pokeImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  typesContainer: {
    flexDirection: "row",
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },
  typeBadgeText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 12,
  },
  // Info Cards
  infoCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Physical Stats
  physicalRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  physicalItem: {
    alignItems: "center",
    flex: 1,
  },
  physicalLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  physicalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  // Stats
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    textTransform: "uppercase",
    flex: 1,
  },
  barContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 2,
    marginLeft: 8,
  },
  bar: {
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    minWidth: 20,
    backgroundColor: "#4CAF50",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    minWidth: 20,
    textAlign: "right",
  },
  // Abilities
  abilityItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  abilityText: {
    fontSize: 16,
    color: "#333",
    textTransform: "capitalize",
  },
  // Moves
  movesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  moveItem: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  moveText: {
    fontSize: 14,
    color: "#666",
    textTransform: "capitalize",
    textAlign: "center",
  },
});
