import AsyncStorage from "@react-native-async-storage/async-storage";
import { groupsGetAll } from "./groupsGetAll";
import { GROUP_COLLECTION, PLAYER_COLLECTION } from "@storage/storageConfig";


export async function groupRemoveByName(name: string) {
  try {
    
    const storageGroups = await groupsGetAll();
    const groupsFiltered = storageGroups.filter(group => group !== name);

    await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(groupsFiltered));
    await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${name}`);

  } catch (error) {
    throw error;
  }
}