import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
  ],
  framework: '@storybook/nextjs',
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    // Remove external config that might conflict
    if (config.externals) {
      config.externals = Array.isArray(config.externals)
        ? config.externals.filter((ext: any) => ext !== '@grpc' && ext !== 'protobufjs')
        : config.externals;
    }
    return config;
  },
};

export default config;
