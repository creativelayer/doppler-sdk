import { Address } from "viem";
import { ChainConfig } from "./types";
import {
  CHAIN_IDS,
  START_BLOCKS,
  V4_START_BLOCKS,
  ORACLE_ADDRESSES,
  COMMON_ADDRESSES,
  RPC_ENV_VARS
} from "./constants";

export const baseSepoliaConfig: ChainConfig = {
  id: CHAIN_IDS.baseSepolia,
  name: "baseSepolia",
  startBlock: START_BLOCKS.baseSepolia,
  v4StartBlock: V4_START_BLOCKS.baseSepolia,
  oracleStartBlock: START_BLOCKS.mainnet,
  rpcEnvVar: RPC_ENV_VARS.baseSepolia,
  addresses: {
    v2: {
      factory: "0x7Ae58f10f7849cA6F5fB71b7f45CB416c9204b1e" as Address,
    },
    v3: {
      v3Initializer: "0x4c3062b9ccfdbcb10353f57c1b59a29d4c5cfa47" as Address,
    },
    v4: {
      poolManager: "0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408" as Address,
      dopplerDeployer: "0x4bf819dfa4066bd7c9f21ea3db911bd8c10cb3ca" as Address,
      v4Initializer2: COMMON_ADDRESSES.ZERO_ADDRESS,
      dopplerLens: "0x4a8d81db741248a36d9eb3bc6ef648bf798b47a7" as Address,
      stateView: "0x571291b572ed32ce6751a2cb2486ebee8defb9b4" as Address,
      v4Initializer: "0xca2079706a4c2a4a1aa637dfb47d7f27fe58653f" as Address,
      v4Migrator: "0xb2ec6559704467306d04322a5dc082b2af4562dd" as Address,
      v4MigratorHook: "0x1cb2230a3b228014532dd491b0ba385e53b7a000" as Address,
    },
    shared: {
      airlock: "0x3411306ce66c9469bff1535ba955503c4bde1c6e" as Address,
      tokenFactory: "0xc69ba223c617f7d936b3cf2012aa644815dbe9ff" as Address,
      universalRouter: "0x492e6456d9528771018deb9e87ef7750ef184104" as Address,
      governanceFactory: "0x9dbfaadc8c0cb2c34ba698dd9426555336992e20" as Address,
      migrator: "0xb2ec6559704467306d04322a5dc082b2af4562dd" as Address,
      weth: COMMON_ADDRESSES.WETH_BASE,
    },
    oracle: ORACLE_ADDRESSES,
  },
};

export const baseConfig: ChainConfig = {
  id: CHAIN_IDS.base,
  name: "base",
  startBlock: START_BLOCKS.base,
  v4StartBlock: V4_START_BLOCKS.base,
  oracleStartBlock: START_BLOCKS.mainnet,
  rpcEnvVar: RPC_ENV_VARS.base,
  addresses: {
    v2: {
      factory: "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6" as Address,
    },
    v3: {
      v3Initializer: "0xaA47D2977d622DBdFD33eeF6a8276727c52EB4e5" as Address,
    },
    v4: {
      poolManager: "0x498581ff718922c3f8e6a244956af099b2652b2b" as Address,
      dopplerDeployer: "0x014E1c0bd34f3B10546E554CB33B3293fECDD056" as Address,
      v4Initializer: "0x8AF018e28c273826e6b2d5a99e81c8fB63729b07" as Address,
      v4Initializer2: "0x77EbfBAE15AD200758E9E2E61597c0B07d731254" as Address,
      stateView: "0xa3c0c9b65bad0b08107aa264b0f3db444b867a71" as Address,
      dopplerLens: "0x094d926a969b3024ca46d2186bf13fd5cdba9ce2" as Address,
      v4Migrator: "0x82Cc0DAAea3c9Ee022bC61dbC7Bf6dB6460b6000" as Address,
      v4MigratorHook: "0x82cc0daaea3c9ee022bc61dbc7bf6db6460b6000" as Address,
    },
    shared: {
      airlock: "0x660eAaEdEBc968f8f3694354FA8EC0b4c5Ba8D12" as Address,
      tokenFactory: "0xFAafdE6a5b658684cC5eb0C5c2c755B00A246F45" as Address,
      universalRouter: "0x6ff5693b99212da76ad316178a184ab56d299b43" as Address,
      governanceFactory: "0xb4deE32EB70A5E55f3D2d861F49Fb3D79f7a14d9" as Address,
      migrator: "0x5F3bA43D44375286296Cb85F1EA2EBfa25dde731" as Address,
      weth: COMMON_ADDRESSES.WETH_BASE,
    },
    oracle: ORACLE_ADDRESSES,
  },
};
