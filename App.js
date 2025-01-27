import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ServicosScreen from './screens/Servicos';
import AgendamentoScreen from './screens/agendamento';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';


const Tab = createBottomTabNavigator()

function App(){
  return(
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Agendamento</Text>
      </View>
      <AgendamentoScreen/>
    </View>
    
    /*<NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#70a1ff', // Cor de fundo do header
          },
          headerTintColor: '#FFF', // Cor do título no header
          tabBarActiveTintColor: '#70a1ff', // Cor da tab selecionada
          tabBarInactiveTintColor: '#777', // Cor da tab não selecionada
        }}
      >
        <Tab.Screen 
          name='Serviços' 
          component={ServicosScreen}
          options={{
            tabBarIcon: ({color, size}) =>(
              <FontAwesome5 name="toolbox" size={size} color={color} />
            )
          }}
          />

        <Tab.Screen 
          name='Agendamento' 
          component={AgendamentoScreen}
          options={{
            tabBarIcon: ({color, size}) =>(
              <FontAwesome5 name="calendar" size={size} color={color} />
            )
          }}
          />
      </Tab.Navigator>
    </NavigationContainer>*/
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#70a1ff', 
    height: 70, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  headerText: {
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: 'bold', 
  },
})

export default App