import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AgendamentosScreen() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoAgendamento, setNovoAgendamento] = useState({
    cliente: '',
    contato: '',
    data: '',
    hora: '',
    servico: '',
    valor: '', // Novo campo para valor da consulta
  });

  // Carregar agendamentos armazenados
  useEffect(() => {
    const carregarAgendamentos = async () => {
      const dados = await AsyncStorage.getItem('agendamentos');
      if (dados) setAgendamentos(JSON.parse(dados));
    };
    carregarAgendamentos();
  }, []);

  // Salvar agendamentos no AsyncStorage
  const salvarAgendamentos = async (novosAgendamentos) => {
    setAgendamentos(novosAgendamentos);
    await AsyncStorage.setItem('agendamentos', JSON.stringify(novosAgendamentos));
  };

  // Adicionar novo agendamento
  const adicionarAgendamento = () => {
    const { cliente, contato, data, hora, servico, valor } = novoAgendamento;

    // Verifica se todos os campos estão preenchidos.
    if (!cliente || !contato || !data || !hora || !servico || !valor) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    const novoItem = {
      id: Date.now().toString(),
      cliente,
      contato,
      data,
      hora,
      servico,
      valor,
    };

    const novosAgendamentos = [...agendamentos, novoItem];
    salvarAgendamentos(novosAgendamentos);
    setModalVisible(false);
    setNovoAgendamento({
      cliente: '',
      contato: '',
      data: '',
      hora: '',
      servico: '',
      valor: '', // Reset do campo valor
    });
  };

  // Remover agendamento
  const removerAgendamento = (id) => {
    Alert.alert(
      'Confirmar',
      'Você deseja remover este agendamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: () => {
            const novosAgendamentos = agendamentos.filter((item) => item.id !== id);
            salvarAgendamentos(novosAgendamentos);
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Renderizar cada item da lista
  const renderItem = ({ item }) => (
    <View style={styles.agendamentoCard}>
      <View style={styles.infoContainer}>
        <Text style={styles.horario}>
          {item.data} - {item.hora}
        </Text>
        <Text style={styles.cliente}>{item.cliente}</Text>
        <Text style={styles.servico}>{item.servico}</Text>
      </View>
      <View style={styles.valorContainer}>
        <Text style={styles.valor}>R$ {item.valor}</Text>
        <TouchableOpacity onPress={() => removerAgendamento(item.id)}>
          <Text style={{ color: 'red', marginTop: 8 }}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={agendamentos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum agendamento disponível.</Text>
        }
      />

      <TouchableOpacity style={styles.botaoAdicionar} onPress={() => setModalVisible(true)}>
        <Text style={{ color: '#fff', fontSize: 24 }}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.voltar} onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#4a90e2', fontWeight: 'bold' }}>Voltar</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitulo}>Novo Agendamento</Text>

            <Text style={styles.label}>Cliente</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Mateus Miranda"
              value={novoAgendamento.cliente}
              onChangeText={(text) =>
                setNovoAgendamento({ ...novoAgendamento, cliente: text })
              }
            />

            <Text style={styles.label}>Número de contato</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 71 9 9999-9999"
              value={novoAgendamento.contato}
              onChangeText={(text) =>
                setNovoAgendamento({ ...novoAgendamento, contato: text })
              }
            />

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Data</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/AAAA"
                  value={novoAgendamento.data}
                  onChangeText={(text) =>
                    setNovoAgendamento({ ...novoAgendamento, data: text })
                  }
                />
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Hora</Text>
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM"
                  value={novoAgendamento.hora}
                  onChangeText={(text) =>
                    setNovoAgendamento({ ...novoAgendamento, hora: text })
                  }
                />
              </View>
            </View>

            <Text style={styles.label}>Serviços</Text>
            <TextInput
              style={styles.input}
              placeholder="Selecionar"
              value={novoAgendamento.servico}
              onChangeText={(text) =>
                setNovoAgendamento({ ...novoAgendamento, servico: text })
              }
            />

            <Text style={styles.label}>Valor da consulta</Text>
            <TextInput
              style={styles.input}
              placeholder="R$ 0,00"
              keyboardType="numeric"
              value={novoAgendamento.valor}
              onChangeText={(text) =>
                setNovoAgendamento({ ...novoAgendamento, valor: text })
              }
            />

            <TouchableOpacity style={styles.botaoSalvar} onPress={adicionarAgendamento}>
              <Text style={styles.textoBotao}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
      },
    
      agendamentoCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 8,
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      },
    
      infoContainer: {
        flex: 1,
      },
    
      horario: {
        fontSize: 14,
        color: '#555',
      },
    
      cliente: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    
      servico: {
        fontSize: 14,
        color: '#777',
      },
    
      valorContainer: {
        alignItems: 'center',
      },
    
      valor: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
      },
    
      botaoAdicionar: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: '#4a90e2',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
      },
    
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
    
      modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        width: '90%',
      },
    
      voltar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
      },
    
      modalTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4a90e2',
        marginLeft: 8,
        marginBottom: 10,
      },
    
      label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
      },
    
      input: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ddd',
      },
    
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
    
      col: {
        flex: 1,
        marginRight: 8,
      },
    
      botaoSalvar: {
        backgroundColor: '#4a90e2',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
      },
    
      textoBotao: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
    
      emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
      },
});
