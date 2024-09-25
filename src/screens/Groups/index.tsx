import { Header } from '@components/Header';
import { Container } from './styles';
import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { ListEmpty } from '@components/ListEmpty';
import { useState, useCallback } from 'react';
import { Alert, FlatList } from 'react-native';
import { Button } from '@components/Button';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; 
import { groupsGetAll } from '@storage/group/groupsGetAll';

export function Groups() {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);

  const navigation = useNavigation();

  function handleNewGroup() {
    // Navigate to the NewGroup screen
    navigation.navigate('new');
  }

  async function fetchGroups() {
    try {
      setIsLoading(true);
      const data = await groupsGetAll();
      setGroups(data);
     
    } catch (error) {
      console.log(error);
      Alert.alert('Turmas', 'Não foi possível buscar as turmas');
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenGroup(group: string) {
    navigation.navigate('players', { group });
  }

  useFocusEffect(useCallback(() => {
    fetchGroups();
  }, [])); 

  return (
    <Container>
      <Header />
      <Highlight title="Grupos" subtitle="Aqui você pode ver todos os grupos disponíveis" />

      {
        isLoading ? <ListEmpty message="Carregando turmas..." /> :
        <FlatList
          data={groups}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <GroupCard 
              title={item} 
              onPress={() => handleOpenGroup(item)}
            />
          )}
          contentContainerStyle={groups.length === 0 && { flex: 1 }}
          ListEmptyComponent={<ListEmpty message="Que tal cadastrar a primeira turma?" />}
          showsVerticalScrollIndicator={false}
        />
      }

      <Button title="Criar nova turma" onPress={handleNewGroup}/>
    </Container>
  );
}
