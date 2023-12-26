import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  testEnvironment: "node",
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  }
};

export default config;