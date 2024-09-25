import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlayerStorageDTO } from "./PlayerStorageDTO";
import { PLAYER_COLLECTION } from "@storage/storageConfig";

export async function playersGetByGroup(group: string): Promise<PlayerStorageDTO[]> {
  try {
    const players = await AsyncStorage.getItem(`${PLAYER_COLLECTION}-${group}`);
    return players ? JSON.parse(players) : [];
  } catch (error) {
    throw error;
  }
}