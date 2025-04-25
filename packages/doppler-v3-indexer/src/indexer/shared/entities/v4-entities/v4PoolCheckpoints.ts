import { Context } from "ponder:registry";
import { v4PoolCheckpoints } from "ponder:schema";
import { Address, parseEther } from "viem";
import { getLatestSqrtPrice } from "@app/utils/v4-utils/getV4PoolData";
import { PoolKey } from "@app/types/v4-types";
import { computeV4Price } from "@app/utils/v4-utils/computeV4Price";
import { computeDollarPrice } from "@app/utils/computePrice";
import { computeMarketCap, fetchEthPrice } from "../../oracle";
import { updateAsset, updatePool } from "..";
import { replaceBigInts } from "ponder";

interface V4PoolCheckpoint {
  [poolAddress: Address]: Checkpoint;
}

interface Checkpoint {
  poolKey: PoolKey;
  asset: Address;
  isToken0: boolean;
  totalSupply: string;
  startingTime: string;
  endingTime: string;
  epochLength: string;
  lastUpdated: string;
}

export const insertV4PoolCheckpointsIfNotExist = async ({
  context,
}: {
  context: Context;
}) => {
  const { db, network } = context;
  const chainId = network.chainId;

  const existingConfig = await db.find(v4PoolCheckpoints, {
    chainId,
  });

  if (existingConfig) {
    return existingConfig;
  }

  return await db.insert(v4PoolCheckpoints).values({
    chainId,
    checkpoints: {},
  });
};

export const updateV4PoolCheckpoints = async ({
  context,
  update,
}: {
  context: Context;
  update?: Partial<typeof v4PoolCheckpoints.$inferInsert>;
}) => {
  const { db, network } = context;
  const chainId = network.chainId;

  await db
    .update(v4PoolCheckpoints, {
      chainId,
    })
    .set({
      ...update,
    });
};

export const addV4PoolCheckpoint = async ({
  poolAddress,
  asset,
  totalSupply,
  startingTime,
  endingTime,
  epochLength,
  isToken0,
  poolKey,
  context,
}: {
  poolAddress: Address;
  asset: Address;
  totalSupply: bigint;
  startingTime: bigint;
  endingTime: bigint;
  epochLength: bigint;
  isToken0: boolean;
  poolKey: PoolKey;
  context: Context;
}) => {
  const { db, network } = context;
  const chainId = network.chainId;

  const checkpointWithoutBigInts = {
    poolKey,
    asset,
    isToken0,
    totalSupply: totalSupply.toString(),
    startingTime: startingTime.toString(),
    endingTime: endingTime.toString(),
    epochLength: epochLength.toString(),
    lastUpdated: startingTime.toString(),
  };

  const existingData = await db.find(v4PoolCheckpoints, {
    chainId,
  });

  if (!existingData) {
    throw new Error("V4 pool checkpoints not found");
  }

  const data: V4PoolCheckpoint = {
    [poolAddress]: {
      ...checkpointWithoutBigInts,
    },
  };

  await db
    .update(v4PoolCheckpoints, {
      chainId,
    })
    .set({
      checkpoints: {
        ...(existingData.checkpoints as V4PoolCheckpoint),
        ...data,
      },
    });
};

export const refreshV4PoolCheckpoints = async ({
  context,
  timestamp,
}: {
  context: Context;
  timestamp: number;
}) => {
  const { db, network } = context;
  const chainId = network.chainId;

  console.log(`Refreshing V4 pool checkpoints for chainId ${chainId}`);

  const existingData = await db.find(v4PoolCheckpoints, {
    chainId,
  });

  if (!existingData) {
    console.log("V4 pool checkpoints not found");
    return;
  }

  const checkpoints = existingData.checkpoints as V4PoolCheckpoint;
  const poolsToRefresh: Address[] = [];
  const updatedCheckpoints: V4PoolCheckpoint = {};

  for (const [poolAddress, checkpoint] of Object.entries(checkpoints)) {
    // remove pools that have ended
    if (checkpoint.endingTime <= timestamp) {
      continue;
    }

    // skip pools that havent started yet
    if (timestamp < checkpoint.startingTime) {
      updatedCheckpoints[poolAddress as Address] = checkpoint;
      continue;
    }

    // calculate current epoch and last updated epoch
    const currentEpoch =
      (timestamp - checkpoint.startingTime) / checkpoint.epochLength;
    const lastUpdatedEpoch =
      (checkpoint.lastUpdated - checkpoint.startingTime) /
      checkpoint.epochLength;

    if (currentEpoch > lastUpdatedEpoch) {
      poolsToRefresh.push(poolAddress as Address);
    }

    updatedCheckpoints[poolAddress as Address] = checkpoint;
  }

  console.log(`Found ${poolsToRefresh.length} pools to refresh`);

  const ethPrice = await fetchEthPrice(BigInt(timestamp), context);

  const updates = await Promise.all(
    poolsToRefresh.map(async (poolAddress) => {
      const checkpoint = checkpoints[poolAddress as Address];

      if (!checkpoint) {
        throw new Error("Checkpoint not found");
      }

      console.log("timestamp", timestamp);
      console.log("checkpoint", checkpoint);

      const { sqrtPriceX96, tick } = await getLatestSqrtPrice({
        isToken0: checkpoint.isToken0,
        poolKey: checkpoint.poolKey,
        context,
      });

      return {
        poolAddress,
        isToken0: checkpoint.isToken0,
        sqrtPriceX96,
        tick,
        totalSupply: checkpoint.totalSupply,
        asset: checkpoint.asset,
      };
    })
  );

  for (const update of updates) {
    const { poolAddress, sqrtPriceX96, tick, totalSupply, asset } = update;

    const price = computeV4Price({
      currentTick: tick,
      isToken0: update.isToken0,
      baseTokenDecimals: 18,
    });

    const unitPrice = computeDollarPrice({
      sqrtPriceX96,
      totalSupply: parseEther(update.totalSupply),
      ethPrice,
      isToken0: update.isToken0,
      decimals: 18,
    });

    const marketCap = computeMarketCap({
      price: unitPrice,
      ethPrice,
      totalSupply: parseEther(update.totalSupply),
    });

    await Promise.all([
      updatePool({
        poolAddress,
        context,
        update: {
          unitPriceUsd: unitPrice,
          price: price,
        },
      }),
      updateAsset({
        assetAddress: asset,
        context,
        update: {
          marketCapUsd: marketCap,
        },
      }),
    ]);
  }

  await db
    .update(v4PoolCheckpoints, {
      chainId,
    })
    .set({
      checkpoints: updatedCheckpoints,
    });

  return poolsToRefresh;
};
