import { Ability, AbilityId } from "./ability";

type FantasyClassId = "knight" | "wizard" | "cleric" | "rogue";

abstract class BaseClass {
  readonly id: FantasyClassId;
  readonly abilities: readonly Ability[];

  protected constructor(id: FantasyClassId, abilities: readonly Ability[]) {
    this.id = id;
    this.abilities = abilities;
  }

  getAbility(abilityId: AbilityId): Ability | undefined {
    return this.abilities.find((ability) => ability.id === abilityId);
  }
}

export { BaseClass, FantasyClassId };
