import { PositionGroupTargetAbility } from "./ability";
import { BaseClass } from "./base_class";

class Hex extends PositionGroupTargetAbility {
  constructor() {
    super("hex", "Reduces a selected opponent position group by 10%.");
  }
}

class ArcaneSurge extends PositionGroupTargetAbility {
  constructor() {
    super("arcane-surge", "Boosts a selected own position group by 10%.");
  }
}

class Wizard extends BaseClass {
  constructor() {
    super("wizard", [new Hex(), new ArcaneSurge()]);
  }
}

export { ArcaneSurge, Hex, Wizard };
