import AsyncStorage from "@react-native-async-storage/async-storage";
import { playersGetByGroup } from "./playersGetByGroup";

export async function playersGetByGroupAndTeam(group: string, team: string) {
  try {
    const players = await playersGetByGroup(group);

    const playersFiltered = players.filter(player => player.team === team);
    return playersFiltered;
  } catch (error) {
    throw error;
  }
}