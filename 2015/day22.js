/**
 * Hit Points: 51
 * Damage: 9
 */

doTheThing(false);
doTheThing(true);

function doTheThing(hardMode) {
  const spells = ["missile", "drain", "shield", "poison", "recharge"];

  const queue = [];
  for (let spell of spells) {
    queue.push({
      hp: 50,
      mana: 500,
      boss: 51,
      shield: 0,
      poison: 0,
      recharge: 0,
      cost: 0,
      invalid: false,
      spell,
    });
  }

  let minCost = Infinity;
  while (queue.length) {
    const state = queue.pop();
    tick(state, hardMode);
    // check win/lose condition
    if (state.hp <= 0 || state.invalid || state.cost >= minCost) continue;
    if (state.boss <= 0) {
      if (state.cost < minCost) minCost = state.cost;
      continue;
    }
    // enqueue state with next spells
    for (let spell of spells) {
      queue.push({ ...state, spell });
    }
  }

  console.log(`Part ${hardMode ? "2" : "1"}: ${minCost}`);
}

function tick(state, hardMode) {
  // player turn
  if (hardMode) {
    state.hp--;
    if (state.hp === 0) return;
  }
  applyEffects(state);
  decrementTimers(state);
  if (state.boss <= 0) return;
  // cast spell
  switch (state.spell) {
    case "missile":
      state.mana -= 53;
      state.cost += 53;
      state.boss -= 4;
      break;
    case "drain":
      state.mana -= 73;
      state.cost += 73;
      state.boss -= 2;
      state.hp += 2;
      break;
    case "shield":
      if (state.shield) {
        state.invalid = true;
        return;
      }
      state.mana -= 113;
      state.cost += 113;
      state.shield = 6;
      break;
    case "poison":
      if (state.poison) {
        state.invalid = true;
        return;
      }
      state.mana -= 173;
      state.cost += 173;
      state.poison = 6;
      break;
    case "recharge":
      if (state.recharge) {
        state.invalid = true;
        return;
      }
      state.mana -= 229;
      state.cost += 229;
      state.recharge = 5;
      break;
  }
  if (state.mana < 0) {
    state.invalid = true;
    return;
  }

  // boss turn
  applyEffects(state);
  decrementTimers(state);
  if (state.boss <= 0) return;
  // attack
  const armor = state.shield ? 7 : 0;
  state.hp -= 9 - armor;
}

function applyEffects(state) {
  if (state.recharge > 0) state.mana += 101;
  if (state.poison) state.boss -= 3;
}

function decrementTimers(state) {
  state.shield = Math.max(state.shield - 1, 0);
  state.poison = Math.max(state.poison - 1, 0);
  state.recharge = Math.max(state.recharge - 1, 0);
}
