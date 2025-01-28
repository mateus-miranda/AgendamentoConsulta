import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AgendamentoScreen from './screens/agendamento';


function App(){
  return(
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Agendamento</Text>
      </View>
      <AgendamentoScreen/>
    </View>
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