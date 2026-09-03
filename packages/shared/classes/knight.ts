import { NoTargetAbility, PlayerTargetAbility } from "./ability";
import { BaseClass } from "./base_class";

class Fortify extends NoTargetAbility {
  constructor() {
    super("fortify", "Blocks one incoming harmful effect.");
  }
}

class Charge extends PlayerTargetAbility {
  protected readonly validPositions = ["RB", "TE"] as const;

  constructor() {
    super("charge", "Boosts a selected starting RB or TE by 10%.");
  }
}

class Knight extends BaseClass {
  constructor() {
    super("knight", [new Fortify(), new Charge()]);
  }
}

export { Charge, Fortify, Knight };
