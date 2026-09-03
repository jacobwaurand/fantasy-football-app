import Position from "./position";

type AbilityId =
  | "fortify"
  | "charge"
  | "hex"
  | "arcane-surge"
  | "healing"
  | "sanctuary"
  | "pickpocket"
  | "evasion";

type AbilityTarget =
  | { kind: "none" }
  | { kind: "player"; playerId: number; position: Position }
  | { kind: "position-group"; position: Position };

abstract class Ability {
  readonly id: AbilityId;
  readonly description: string;

  protected constructor(id: AbilityId, description: string) {
    this.id = id;
    this.description = description;
  }

  abstract isValidTarget(target: AbilityTarget): boolean;
}

abstract class NoTargetAbility extends Ability {
  isValidTarget(target: AbilityTarget): boolean {
    return target.kind === "none";
  }
}

abstract class PlayerTargetAbility extends Ability {
  protected abstract readonly validPositions: readonly Position[];

  isValidTarget(target: AbilityTarget): boolean {
    return (
      target.kind === "player" && this.validPositions.includes(target.position)
    );
  }
}

abstract class PositionGroupTargetAbility extends Ability {
  isValidTarget(target: AbilityTarget): boolean {
    return target.kind === "position-group";
  }
}

export {
  Ability,
  AbilityId,
  AbilityTarget,
  NoTargetAbility,
  PlayerTargetAbility,
  PositionGroupTargetAbility,
};
