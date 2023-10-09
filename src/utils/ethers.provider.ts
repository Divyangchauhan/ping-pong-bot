import { ethers } from 'ethers';

export const getEthersProvider = (): ethers.providers.FallbackProvider => {
  const infuraProvider = new ethers.providers.InfuraProvider(
    process.env.Network,
    process.env.InfuraAPIKey,
  );

  const alchemyProvider = new ethers.providers.AlchemyProvider(
    process.env.Network,
    process.env.AlchemyAPIKey,
  );

  const pocketProvider = new ethers.providers.PocketProvider(
    process.env.Network,
    process.env.PocketAPIKey,
  );

  return new ethers.providers.FallbackProvider(
    // We can add more providers here
    [infuraProvider, alchemyProvider, pocketProvider],
    // 1 providers is enough since it is testnet, we can increase quorum for mainnet
    1,
  );
};
