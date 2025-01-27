import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { FontAwesome5, FontAwesome6, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ServicosScreen({navigation}){
    {/*State do modal para criar o serviço */}
    const [modalVisible, setModalVisible] = useState(false);
    {/*State do modal para editar/excluir o serviço */}
    const [modalEditarVisible, setModalEditarVisible] = useState(false);
    {/*State do serviço selecionado no momento */}
    const [servicoSelecionado, setServicoSelecionado] = useState(null)
    {/*State das entrada de dados */}
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [duracao, setDuracao] = useState('');

    {/*Array com os serviços iniciais */}
    const [servicos, setServicos] = useState([
        { id: 1, nome: 'Terapia individual', preco: 'R$ 100', duracao: '60 min' },
        { id: 2, nome: 'Terapia familiar', preco: 'R$ 250', duracao: '90 min' },
      ]);

    {/* Função para salvar o Serviço após preencher o form no modal */}
    const salvarServico = async () => {
        if (nome && preco && duracao) {
            const novoServico = {
                id: servicos.length + 1,
                nome: nome,
                preco: `R$ ${preco}`,
                duracao: `${duracao} min`
            }
            const novaLista = [...servicos, novoServico];
            setServicos(novaLista)
            await AsyncStorage.setItem('servicos', JSON.stringify(novaLista));
            setModalVisible(false);
            setNome('')
            setPreco('')
            setDuracao('')
        } else {
            alert('Por favor, preencha todos os campos!')
        }
    }
    
    {/*Função para pegar o serviço que foi clicado e abrir o modal para edição/remoção */}
    const abrirModalEditar = (servico) => {
        setServicoSelecionado(servico);
        setModalEditarVisible(true)
    }

    {/*Função para editar o serviço */}
    const editarServico = async () => {
        if (servicoSelecionado && servicoSelecionado.nome && servicoSelecionado.preco && servicoSelecionado.duracao) {
            const novaLista = servicos.map((s) =>
                s.id === servicoSelecionado.id ? servicoSelecionado : s
            );
            setServicos(novaLista);
            await AsyncStorage.setItem('servicos', JSON.stringify(novaLista));
            setModalEditarVisible(false);
        } else {
            alert('Por favor, preencha todos os campos!');
        }
    };

    {/*Função para remover o serviço */}
    const removerServico = async (id) => {
        const novaLista = servicos.filter((s) => s.id !== id);
        setServicos(novaLista);
        await AsyncStorage.setItem('servicos', JSON.stringify(novaLista));
        setModalEditarVisible(false);
    };

    {/* Serve para carregar os serviços salvos do AsyncStorage assim que o aplicativo for iniciado. */}
    useEffect(() => {
        const carregarServicos = async () => {
            const servicosSalvos = await AsyncStorage.getItem('servicos');
            if (servicosSalvos){
                setServicos(JSON.parse(servicosSalvos))
            }
        }
        carregarServicos();
    }, []);


    return(
        <View style={styles.container}>
            
             {/* Início do Container do serviço */}
             <View style={styles.containerServico}>
                {/* Lista dinâmica de serviços */}
                {servicos.map((servico) => (
                    <View key={servico.id} style={styles.servico}>
                        <View style={styles.esquerda}>
                            <FontAwesome5 name="tools" size={24} color="#70a1ff" paddingRight={10} />
                            <Text style={styles.textServico}>{servico.nome}</Text>
                        </View>

                        <View style={styles.direita}>
                            <Text style={styles.textServico}>{servico.preco}</Text>
                            <TouchableOpacity onPress={() => abrirModalEditar(servico)}>
                                <FontAwesome6 name="ellipsis-vertical" size={24} color="black" paddingLeft={10} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
            {/* Final do Container do serviço */}

            {/*Botão para adicionar um novo servico*/}
            <TouchableOpacity style={styles.botaoNovoServico} onPress={() => setModalVisible(true)}>
                <AntDesign name="plus" size={24} color="#FFF" />
            </TouchableOpacity>

            {/* Modal para adicionar novo serviço */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Header do modal */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Adicionar Serviço</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <AntDesign name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        {/* Campo Nome */}
                        <Text style={styles.label}>Nome</Text>
                        <TextInput
                        style={styles.input}
                        placeholder="Ex: Terapia Jovem Adulto"
                        value={nome}
                        onChangeText={setNome}
                        />

                        {/* Campos Preço e Duração */}
                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text style={styles.label}>Preço</Text>
                                <TextInput
                                style={styles.input}
                                placeholder="R$"
                                keyboardType="numeric"
                                value={preco}
                                onChangeText={setPreco}
                                />
                            </View>
                            <View style={styles.column}>
                                <Text style={styles.label}>Duração</Text>
                                <TextInput
                                style={styles.input}
                                placeholder="Min"
                                keyboardType="numeric"
                                value={duracao}
                                onChangeText={setDuracao}
                                />
                            </View>
                        </View>

                        {/* Botão Salvar */}
                        <Button title="Salvar Serviço" onPress={salvarServico} />
                    </View>
                </View>
            </Modal>
            {/* Final do Modal para adicionar novo serviço */}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalEditarVisible}
                onRequestClose={() => setModalEditarVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Editar Serviço</Text>
                            <TouchableOpacity onPress={() => setModalEditarVisible(false)}>
                                <AntDesign name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Nome</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome do serviço"
                            value={servicoSelecionado?.nome}
                            onChangeText={(text) => setServicoSelecionado({ ...servicoSelecionado, nome: text })}
                        />

                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text style={styles.label}>Preço</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="R$"
                                    keyboardType="numeric"
                                    value={servicoSelecionado?.preco.replace('R$ ', '')}
                                    onChangeText={(text) => setServicoSelecionado({ ...servicoSelecionado, preco: `R$ ${text}` })}
                                />
                            </View>
                            <View style={styles.column}>
                                <Text style={styles.label}>Duração</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Min"
                                    keyboardType="numeric"
                                    value={servicoSelecionado?.duracao.replace(' min', '')}
                                    onChangeText={(text) => setServicoSelecionado({ ...servicoSelecionado, duracao: `${text} min` })}
                                />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                            <Button title="Salvar" onPress={editarServico} />
                            <Button title="Remover" color="red" onPress={() => removerServico(servicoSelecionado.id)} />
                        </View>
                    </View>
                </View>
            </Modal>
        
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,  
  
    },
    servico: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#c8d6e5',
        
    },
    esquerda: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
    },
    direita: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
    },
    textServico: {
        fontSize: 16,
        padding: 3,
    },
    botaoNovoServico: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#70a1ff',
        borderRadius: 30,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5, // Adiciona sombra no Android
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 10,
      },
      modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      label: {
        fontSize: 14,
        marginBottom: 5,
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
      },
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      column: {
        width: '48%',
      },

})

export default ServicosScreen