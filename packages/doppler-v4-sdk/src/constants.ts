import { parseEther } from 'ethers/lib/utils';

export const MAX_TICK_SPACING = 30;
export const DEFAULT_PD_SLUGS = 5;
export const DAY_SECONDS = 24 * 60 * 60;
export const ETH_ADDRESS = '0x0000000000000000000000000000000000000000';
export const DEAD_ADDRESS = '0x000000000000000000000000000000000000dEaD';

export const DEFAULT_INITIAL_VOTING_DELAY = 7200;
export const DEFAULT_INITIAL_VOTING_PERIOD = 50400;
export const DEFAULT_INITIAL_PROPOSAL_THRESHOLD = BigInt(0);
export const WAD = BigInt(10 ** 18);
export const WAD_STRING = parseEther('1').toString();
