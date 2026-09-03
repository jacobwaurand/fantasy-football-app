import { NoTargetAbility } from "./ability";
import { BaseClass } from "./base_class";

class Pickpocket extends NoTargetAbility {
  constructor() {
    super("pickpocket", "Transfers 50% of an active opponent score boost.");
  }
}

class Evasion extends NoTargetAbility {
  constructor() {
    super("evasion", "Cancels one incoming harmful effect.");
  }
}

class Rogue extends BaseClass {
  constructor() {
    super("rogue", [new Pickpocket(), new Evasion()]);
  }
}

export { Evasion, Pickpocket, Rogue };
