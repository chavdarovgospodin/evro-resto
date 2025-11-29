import { config } from './gluestack-config';

type ConfigType = typeof config;

declare module '@gluestack-ui/themed' {
  interface IConfig extends ConfigType {}
}
