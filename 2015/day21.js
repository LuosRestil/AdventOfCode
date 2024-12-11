/**
 * Hit Points: 104
 * Damage: 8
 * Armor: 1
 */

const shop = {
  weapons: [
    {cost: 8, damage: 4},
    {cost: 10, damage: 5},
    {cost: 25, damage: 6},
    {cost: 40, damage: 7},
    {cost: 74, damage: 8}
  ],
  armor: [
    {cost: 0, armor: 0},
    {cost: 13, armor: 1},
    {cost: 31, armor: 2},
    {cost: 53, armor: 3},
    {cost: 75, armor: 4},
    {cost: 102, armor: 5},
  ],
  rings: [
    {cost: 0, damage: 0, armor: 0},
    {cost: 25, damage: 1, armor: 0},
    {cost: 50, damage: 2, armor: 0},
    {cost: 100, damage: 3, armor: 0},
    {cost: 20, damage: 0, armor: 1},
    {cost: 40, damage: 0, armor: 2},
    {cost: 80, damage: 0, armor: 3},
  ]
}

// pt 1
let minCost = Infinity;
const possibleInventories = getAllInventories(shop);
  
for (let inventory of possibleInventories) {
  const me = newMe();
  const enemy = newEnemy();
  equipCharacter(me, inventory);
  if (inventory.cost < minCost && willWinBattle(me, enemy)) {
    minCost = inventory.cost;
  }
}
console.log(`Answer: ${minCost}`);

// pt 2
let maxCost = 0;
for (let inventory of possibleInventories) {
  const me = newMe();
  const enemy = newEnemy();
  equipCharacter(me, inventory);
  if (inventory.cost > maxCost && !willWinBattle(me, enemy)) {
    maxCost = inventory.cost;
  }
}
console.log(`Answer: ${maxCost}`);


function getAllInventories(shop) {
  const inventories = [];
  const ringCombos = getRingCombos(shop.rings);
  for (let weapon of shop.weapons) {
    for (let armor of shop.armor) {
      for (let combo of ringCombos) {
        inventories.push({weapon, armor, ring1: combo.ring1, ring2: combo.ring2});
      }
    }
  }
  return inventories.map(inventory => {
    return {...inventory,
      totalDamage: inventory.weapon.damage + 
              inventory.ring1.damage + 
              inventory.ring2.damage,
      totalArmor: inventory.armor.armor + 
             inventory.ring1.armor + 
             inventory.ring2.armor,
      cost: inventory.weapon.cost + 
            inventory.armor.cost + 
            inventory.ring1.cost + 
            inventory.ring2.cost
    }
  });
}

function getRingCombos(rings) {
  const combos = [];
  for (let i = 0; i < rings.length; i++) {
    combos.push({ring1: rings[i], ring2: {cost: 0, armor: 0, damage: 0}});
    for (let j = i + 1; j < rings.length; j++) {
      combos.push({ring1: rings[i], ring2: rings[j]});
    }
  }
  return combos;
}

function newMe() {
  return {
    hp: 100,
    damage: 0,
    armor: 0
  }
}

function newEnemy() {
  return {
    hp: 104,
    damage: 8,
    armor: 1
  }
}

function equipCharacter(character, inventory) {
  character.damage += inventory.totalDamage;
  character.armor += inventory.totalArmor;
}

function willWinBattle(me, enemy) {
  const meDmg = Math.max(me.damage - enemy.armor, 1);
  const enemyDmg = Math.max(enemy.damage - me.armor, 1);
  const turnsToKill = Math.ceil(enemy.hp / meDmg);
  const turnsToDie = Math.ceil(me.hp / enemyDmg);
  return turnsToDie >= turnsToKill;
}