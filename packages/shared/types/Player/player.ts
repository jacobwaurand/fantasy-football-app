import Position from '../position';

type Player = {
    id: number;
    name: string;
    position: Position;
    sleeper_id: string;
    team: string;
    created_at: string;
    updated_at: string;
}
export { Player };