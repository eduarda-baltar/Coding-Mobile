import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Cat = {
  id: string;
  url: string;
  width: number;
  height: number;
};

const API_URL = "https://api.thecatapi.com/v1/images/search?limit=10";

export default function App() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadCats() {
    try {
      const res = await fetch(API_URL);
      const data: Cat[] = await res.json();
      setCats(data);
    } catch (e) {
      console.error("Erro ao carregar gatos:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadCats();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Carregando gatinhos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cats}
        keyExtractor={(item) => item.id}
        onRefresh={loadCats}
        refreshing={refreshing}
        ListEmptyComponent={
          <Text style={styles.muted}>Nenhum gatinho encontrado 😿</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.url }}
              style={styles.catImage}
              resizeMode="cover"
            />
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 16 }}
      />

      <TouchableOpacity style={styles.button} onPress={loadCats}>
        <Text style={styles.buttonText}>Carregar mais gatinhos 🐾</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7F9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { color: "#666", marginTop: 10 },

  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  catImage: {
    width: "100%",
    height: 250,
  },

  button: {
    backgroundColor: "#ff6b81",
    padding: 16,
    margin: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
