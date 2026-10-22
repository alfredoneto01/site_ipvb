import * as migration_20261022_191855_inicial from './20261022_191855_inicial';

export const migrations = [
  {
    up: migration_20261022_191855_inicial.up,
    down: migration_20261022_191855_inicial.down,
    name: '20261022_191855_inicial'
  },
];
