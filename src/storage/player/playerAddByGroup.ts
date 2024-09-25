import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlayerStorageDTO } from "./PlayerStorageDTO";
import { PLAYER_COLLECTION } from "@storage/storageConfig";
import { playersGetByGroup } from "./playersGetByGroup";
import { AppError } from "@utils/AppError";

export async function playerAddByGroup(player: PlayerStorageDTO, group: string) {
  try {
    const storedPlayers = await playersGetByGroup(group);
    const playerAlreadyExists = storedPlayers.find(item => item.name === player.name);
    if (playerAlreadyExists) throw new AppError('Player já cadastrado em algum time');

    const storage = JSON.stringify([...storedPlayers, player]);
    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage);

  } catch (error) {
    throw error;
    
  }
}