import 'react-native-gesture-handler';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import { 
  NavigationContainer, 
  DrawerActions, 
  DefaultTheme as NavLight 
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Provider as PaperProvider,
  MD3LightTheme,
  Appbar,
  Text,
  Button,
  Card,
  Icon,
  ActivityIndicator,
} from 'react-native-paper';

type RootDrawerParamList = {
  Principal: undefined;
  Sobre: undefined;
};

type RootStackParamList = {
  Tabs: undefined;
  Detalhes: { breed?: string } | undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator();

const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: '#FAFAFA',
    surface: '#FFFFFF',
  },
};

const navTheme = {
  ...NavLight,
  colors: {
    ...NavLight.colors,
    background: '#FAFAFA',
    card: '#FFFFFF',
    text: '#1F2937',
    border: '#E5E7EB',
  },
};

function Header({ title, navigation }: any) {
  return (
    <Appbar.Header mode="center-aligned">
      <Appbar.Action icon="menu" onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} />
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}

function ScreenContainer({ children }: { children: React.ReactNode }) {
  return <View style={styles.screen}>{children}</View>;
}

/* ---------------- HOME SCREEN (Dog Random Image) ---------------- */
function HomeScreen({ navigation }: any) {
  const [dogUrl, setDogUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchDog() {
    try {
      setLoading(true);
      const res = await fetch('https://dog.ceo/api/breeds/image/random');
      const json = await res.json();
      setDogUrl(json.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDog();
  }, []);

  return (
    <ScreenContainer>
      <Card mode="elevated">
        <Card.Title title="Imagem Aleatória" left={(props) => <Icon source="dog" size={24} {...props} />} />
        <Card.Content style={{ alignItems: 'center' }}>
          {loading ? (
            <ActivityIndicator animating />
          ) : (
            dogUrl && (
              <Image
                source={{ uri: dogUrl }}
                style={{ width: 250, height: 250, borderRadius: 8, marginVertical: 10 }}
                resizeMode="cover"
              />
            )
          )}
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={fetchDog}>Novo Cachorro</Button>
          <Button onPress={() => navigation.navigate('Detalhes', { breed: 'aleatório' })}>Detalhes</Button>
        </Card.Actions>
      </Card>
    </ScreenContainer>
  );
}

function FeedScreen({ navigation }: any) {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchBreeds() {
    try {
      setLoading(true);
      const res = await fetch('https://dog.ceo/api/breeds/list/all');
      const json = await res.json();
      setBreeds(Object.keys(json.message));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBreeds();
  }, []);

  return (
    <ScreenContainer>
      <Card mode="elevated">
        <Card.Title title="Raças" left={(p) => <Icon source="format-list-bulleted" size={24} {...p} />} />
        <Card.Content>
          {loading ? (
            <ActivityIndicator animating />
          ) : (
            <FlatList
              data={breeds}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Button
                  mode="outlined"
                  style={{ marginVertical: 4 }}
                  onPress={() => navigation.navigate('Detalhes', { breed: item })}
                >
                  {item}
                </Button>
              )}
            />
          )}
        </Card.Content>
      </Card>
    </ScreenContainer>
  );
}

function DetalhesScreen({ route, navigation }: any) {
  const breed = route?.params?.breed ?? 'Desconhecida';
  const [dogUrl, setDogUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchDogByBreed() {
    try {
      setLoading(true);
      const res = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
      const json = await res.json();
      setDogUrl(json.message);
    } catch {
      setDogUrl(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (breed !== 'aleatório') fetchDogByBreed();
  }, [breed]);

  return (
    <>
      <Header title="Detalhes" navigation={navigation} />
      <ScreenContainer>
        <Card>
          <Card.Title title={`Raça: ${breed}`} left={(p) => <Icon source="dog" size={24} {...p} />} />
          <Card.Content style={{ alignItems: 'center' }}>
            {loading ? (
              <ActivityIndicator animating />
            ) : dogUrl ? (
              <Image source={{ uri: dogUrl }} style={{ width: 250, height: 250, borderRadius: 8 }} />
            ) : (
              <Text>Nenhuma imagem disponível.</Text>
            )}
          </Card.Content>
          <Card.Actions>
            <Button onPress={fetchDogByBreed}>Outra Imagem</Button>
            <Button onPress={() => navigation.goBack()}>Voltar</Button>
          </Card.Actions>
        </Card>
      </ScreenContainer>
    </>
  );
}

function TabsScreen() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarStyle: { backgroundColor: '#FFFFFF' },
        tabBarIcon: ({ color, size }) => {
          const icon = route.name === 'Home' ? 'home' : 'rss';
          return <Icon source={icon as any} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Feed" component={FeedScreen} />
    </Tabs.Navigator>
  );
}

function StackPrincipal({ navigation }: any) {
  return (
    <>
      <Header title="Principal" navigation={navigation} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabsScreen} />
        <Stack.Screen name="Detalhes" component={DetalhesScreen} />
      </Stack.Navigator>
    </>
  );
}

function SobreScreen({ navigation }: any) {
  return (
    <>
      <Header title="Sobre" navigation={navigation} />
      <ScreenContainer>
        <Card>
          <Card.Title title="Sobre o App" left={(p) => <Icon source="information" size={24} {...p} />} />
          <Card.Content>
            <Text>
              Este app demonstra o uso de React Native Paper, Drawer, Tabs e consumo da API pública do Dog CEO.
            </Text>
          </Card.Content>
        </Card>
      </ScreenContainer>
    </>
  );
}

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navTheme}>
        <Drawer.Navigator
          screenOptions={{
            headerShown: false,
            drawerActiveTintColor: '#2563EB',
            drawerStyle: { backgroundColor: '#FFFFFF' },
          }}
        >
          <Drawer.Screen
            name="Principal"
            component={StackPrincipal}
            options={{
              drawerIcon: ({ color, size }) => <Icon source="view-dashboard" size={size} color={color} />,
            }}
          />
          <Drawer.Screen
            name="Sobre"
            component={SobreScreen}
            options={{
              drawerIcon: ({ color, size }) => <Icon source="information-outline" size={size} color={color} />,
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
    gap: 16,
  },
});
