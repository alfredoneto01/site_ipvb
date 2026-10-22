import * as migration_20261022_183036_inicial from './20261022_183036_inicial';

export const migrations = [
  {
    up: migration_20261022_183036_inicial.up,
    down: migration_20261022_183036_inicial.down,
    name: '20261022_183036_inicial'
  },
];
