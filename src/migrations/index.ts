import * as migration_20261022_191855_inicial from './20261022_191855_inicial';
import * as migration_20261023_011026_uploadthing_campos from './20261023_011026_uploadthing_campos';

export const migrations = [
  {
    up: migration_20261022_191855_inicial.up,
    down: migration_20261022_191855_inicial.down,
    name: '20261022_191855_inicial',
  },
  {
    up: migration_20261023_011026_uploadthing_campos.up,
    down: migration_20261023_011026_uploadthing_campos.down,
    name: '20261023_011026_uploadthing_campos'
  },
];
