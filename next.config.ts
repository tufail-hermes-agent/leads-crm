import type { NextConfig } from 'next';

const baseConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
};

export default baseConfig;
