import { Header } from "@components/Header";
import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { Alert, FlatList, TextInput } from "react-native";
import { useState, useEffect, useRef } from "react";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppError } from "@utils/AppError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";

type RouteParams = {
  group: string;
}

export function Players() {
  const [isLoading, setIsLoading] = useState(true);
  const [ playerName, setPlayerName ] = useState<string>('');
  const [team, setTeam] = useState<string>('Time A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

  const navigation = useNavigation();
  const route = useRoute();
  const { group } = route.params as RouteParams;

  const playerNameInputRef = useRef<TextInput>(null);

  async function handleAddPlayer() {
   try {
      if(!playerName.trim()) throw new AppError('Nome da pessoa é obrigatório');

      await playerAddByGroup({ name: playerName, team }, group);

      playerNameInputRef.current?.blur();

      fetchPlayersByTeam();
      setPlayerName('');
     
   } catch (error) {
      if(error instanceof AppError) {
        return Alert.alert('Nova pessoa', error.message);
      } else {
        return Alert.alert('Nova pessoa', 'Não foi possível adicionar a pessoa');
      }
   }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true);

      const playersByTeam = await playersGetByGroupAndTeam(group, team);
      
      setPlayers(playersByTeam);
     
    } catch (error) {
      console.log(error);
      Alert.alert('Pessoas', 'Erro ao buscar pessoas');
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group);
      fetchPlayersByTeam();

    } catch (error) {
      console.log(error);
      Alert.alert('Remover pessoa', 'Não foi possível remover a pessoa');
      
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);
      navigation.navigate('groups');

    } catch (error) {
      console.log(error);
      Alert.alert('Remover turma', 'Não foi possível remover a turma');
    }
  }

  async function handleGroupRemove(){
    Alert.alert('Remover turma', `Deseja realmente remover a turma ${group} ?`, [
      {
        text: 'Não',
        style: 'cancel'
      },
      {
        text: 'Sim',
        onPress: () => groupRemove()
      }
    ])
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <Container>
      <Header showBackButton />

      <Highlight title={group} subtitle="Adicione a galera e separe os times" />

      <Form>
        <Input 
          inputRef={playerNameInputRef}
          placeholder="Digite da pessoa" 
          autoCorrect={false} 
          value={playerName}
          onChangeText={setPlayerName}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />
        <ButtonIcon 
          icon="add" 
          onPress={handleAddPlayer}
        />
      </Form>

      <HeaderList>
        <FlatList 
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter title={item} isActive={item === team} onPress={() => setTeam(item)} />
          )}
          horizontal
        />
        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      </HeaderList>

      {
        isLoading ? <ListEmpty message="Carregando..." /> :
        <FlatList 
          data={players}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <PlayerCard name={item.name} onRemove={() => {handlePlayerRemove(item.name)}} />
          )}
          ListEmptyComponent={<ListEmpty message="Não há pessoas nesse time" />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            players.length === 0 && { flex: 1 }
          ]}
        />
      }
      
      <Button 
        title="Remover turma" 
        type="SECONDARY" 
        onPress={handleGroupRemove}
      />
    </Container>
  )
}