import type { Class } from "../Class/class";
type Team = {
    id: number;
    name: string;
    leagueId: number;
    userId: number;
    fantasyClass: Class;
    createdAt: Date;
    updatedAt: Date;
} 
export { Team };