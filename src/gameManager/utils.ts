export const SpawnerType = {
  MONSTER: "MONSTER",
  CHEST: "CHEST",
};

// Use lodash instead????
export const randomNumber = (min, max) => {
  return Math.floor(Math.random() * max) + min;
};
