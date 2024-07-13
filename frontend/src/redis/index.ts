import { createClient, RedisClientType } from 'redis';

// Environment variables
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379;

// Get Redis client
const getRedisClient = async (): Promise<RedisClientType> => {
  try {
    const client = createClient({
        password: 'lEts0gjkWbueBZuAPyDTybuXzp9Casj1',
        socket: {
            host: 'redis-15929.c273.us-east-1-2.ec2.redns.redis-cloud.com',
            port: 15929
        }
    });
    await client.connect();
    return client;
  } catch (err) {
    console.error('Cannot connect to Redis..', err);
    throw new Error(err.message);
  }
};

// Push map to Redis
const pushMapToRedis = async (key: string, object: Record<string, string>): Promise<void> => {
  const client = await getRedisClient();
  await client.hSet(key, object);
  console.log(`Pushed Map to Redis => ${key} -> ${JSON.stringify(object)}`);
  await client.disconnect();
};

// Update map in Redis
const updateMapInRedis = async (key: string, field: string, value: string): Promise<void> => {
  const client = await getRedisClient();
  await client.hSet(key, field, value);
  console.log(`Updated Map in Redis => ${key} -> ${field}: ${value}`);
  await client.disconnect();
};

// Delete map field in Redis
const deleteMapFieldInRedis = async (key: string, field: string): Promise<void> => {
  const client = await getRedisClient();
  await client.hDel(key, field);
  console.log(`Deleted field from Map in Redis => ${key} -> ${field}`);
  await client.disconnect();
};

// Push string to Redis
const pushStringToRedis = async (key: string, value: string | Record<string, unknown>): Promise<void> => {
  if (typeof value !== 'string') value = JSON.stringify(value);
  const client = await getRedisClient();
  await client.set(key, value);
  console.log(`Pushed String to Redis => ${key} -> ${value}`);
  await client.disconnect();
};

// Push string to Redis with expiry
const pushStringToRedisWithExpiry = async (key: string, value: string | Record<string, unknown>, expiry: number): Promise<void> => {
  if (typeof value !== 'string') value = JSON.stringify(value);
  const client = await getRedisClient();
  await client.set(key, value, { EX: expiry });
  console.log(`Pushed String to Redis => ${key} -> ${value} with expiry of ${expiry} Seconds`);
  await client.disconnect();
};

// Update string in Redis
const updateStringInRedis = async (key: string, value: string | Record<string, unknown>): Promise<void> => {
  await pushStringToRedis(key, value);
  console.log(`Updated String in Redis => ${key} -> ${value}`);
};

// Delete string from Redis
const deleteStringFromRedis = async (key: string): Promise<void> => {
  const client = await getRedisClient();
  await client.del(key);
  console.log(`Deleted String from Redis => ${key}`);
  await client.disconnect();
};

// Get string from Redis
const getString = async (key: string): Promise<string | null> => {
  const client = await getRedisClient();
  const value = await client.get(key);
  await client.disconnect();
  return value;
};

// Get map from Redis
const getMap = async (key: string): Promise<Record<string, string> | null> => {
  const client = await getRedisClient();
  const value = await client.hGetAll(key);
  await client.disconnect();
  return Object.keys(value).length ? value : null;
};

// Push list to Redis
const pushListToRedis = async (key: string, values: string[]): Promise<void> => {
  const client = await getRedisClient();
  await client.rPush(key, values);
  console.log(`Pushed List to Redis => ${key} -> ${JSON.stringify(values)}`);
  await client.disconnect();
};

// Update list in Redis (set value at specific index)
const updateListInRedis = async (key: string, index: number | null, value: string): Promise<void> => {
  const client = await getRedisClient();
  if(index)
  await client.lSet(key, index, value);
 else
    await client.rPush(key, value);
  console.log(`Updated List in Redis => ${key}[${index}] -> ${value}`);
  await client.disconnect();
};

// Delete list from Redis
const deleteListFromRedis = async (key: string): Promise<void> => {
  const client = await getRedisClient();
  await client.del(key);
  console.log(`Deleted List from Redis => ${key}`);
  await client.disconnect();
};

// Get list from Redis
const getListFromRedis = async (key: string): Promise<string[]> => {
  const client = await getRedisClient();
  const values = await client.lRange(key, 0, -1);
  await client.disconnect();
  return values;
};

// Push set to Redis
const pushSetToRedis = async (key: string, values: string[]): Promise<void> => {
  const client = await getRedisClient();
  await client.sAdd(key, values);
  console.log(`Pushed Set to Redis => ${key} -> ${JSON.stringify(values)}`);
  await client.disconnect();
};

// Delete set member from Redis
const deleteSetMemberFromRedis = async (key: string, value: string): Promise<void> => {
  const client = await getRedisClient();
  await client.sRem(key, value);
  console.log(`Deleted member from Set in Redis => ${key} -> ${value}`);
  await client.disconnect();
};

// Get set from Redis
const getSetFromRedis = async (key: string): Promise<string[]> => {
  const client = await getRedisClient();
  const values = await client.sMembers(key);
  await client.disconnect();
  return values;
};

// Push sorted set to Redis
const pushSortedSetToRedis = async (key: string, values: { score: number; value: string }[]): Promise<void> => {
  const client = await getRedisClient();
  for (const { score, value } of values) {
    await client.zAdd(key, { score, value });
  }
  console.log(`Pushed Sorted Set to Redis => ${key} -> ${JSON.stringify(values)}`);
  await client.disconnect();
};

// Update sorted set member in Redis (change the score)
const updateSortedSetMemberInRedis = async (key: string, value: string, score: number): Promise<void> => {
  const client = await getRedisClient();
  await client.zAdd(key, { score, value });
  console.log(`Updated Sorted Set in Redis => ${key} -> ${value}: ${score}`);
  await client.disconnect();
};

// Delete sorted set member from Redis
const deleteSortedSetMemberFromRedis = async (key: string, value: string): Promise<void> => {
  const client = await getRedisClient();
  await client.zRem(key, value);
  console.log(`Deleted member from Sorted Set in Redis => ${key} -> ${value}`);
  await client.disconnect();
};

// Get sorted set from Redis
const getSortedSetFromRedis = async (key: string): Promise<{ value: string; score: number }[]> => {
  const client = await getRedisClient();
  const values = await client.zRangeWithScores(key, 0, -1);
  await client.disconnect();
  return values;
};

export {
  getRedisClient,
  pushMapToRedis,
  updateMapInRedis,
  deleteMapFieldInRedis,
  pushStringToRedis,
  pushStringToRedisWithExpiry,
  updateStringInRedis,
  deleteStringFromRedis,
  getString,
  getMap,
  pushListToRedis,
  updateListInRedis,
  deleteListFromRedis,
  getListFromRedis,
  pushSetToRedis,
  deleteSetMemberFromRedis,
  getSetFromRedis,
  pushSortedSetToRedis,
  updateSortedSetMemberInRedis,
  deleteSortedSetMemberFromRedis,
  getSortedSetFromRedis,
};
