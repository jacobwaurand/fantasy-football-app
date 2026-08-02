import { NoTargetAbility, PositionGroupTargetAbility } from "./ability";
import { BaseClass } from "./base_class";

class Healing extends NoTargetAbility {
  constructor() {
    super("healing", "Adds 5 total team points.");
  }
}

class Sanctuary extends PositionGroupTargetAbility {
  constructor() {
    super("sanctuary", "Protects one position group from opponent penalties.");
  }
}

class Cleric extends BaseClass {
  constructor() {
    super("cleric", [new Healing(), new Sanctuary()]);
  }
}

export { Cleric, Healing, Sanctuary };
