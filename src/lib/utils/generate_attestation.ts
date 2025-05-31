import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

import { useWallets } from "@privy-io/react-auth";
import { useAccount } from "wagmi";

// Inside your component or hook:
const { wallets } = useWallets();
const { address } = useAccount();
console.log("Address: ", address);

// Get the first connected wallet
const wallet = wallets[0];
const provider = await wallet.getEthersProvider(); // This will be the browser wallet provider
const signer = await provider?.getSigner();

//const EASContractAddress = '0x54c0726e9d2d57bc37ad52c7e219a3229e0ee963' // Mainnet (has to be in lowercase)
const EASContractAddress = "0xc300aeeadd60999933468738c9f5d7e9c0671e1c"; // Testnet (has to be in lowercase)

// Initialize EAS
const eas = new EAS(EASContractAddress); // EAS contract on Rootstock Mainnet
eas.connect(signer);

// Define schema
const schemaUID =
  "0xf58b8b212ef75ee8cd7e8d803c37c03e0519890502d5e99ee2412aae1456cafe"; // This UID references to https://explorer.testnet.rootstock.io/ras/schema/0xf58b8b212ef75ee8cd7e8d803c37c03e0519890502d5e99ee2412aae1456cafe.
const encoder = new SchemaEncoder("string statement");
const encodedData = encoder.encodeData([
  { name: "statement", value: "Roostock Attestation!", type: "string" },
]);

// Make attestation
const tx = await eas.attest({
  schema: schemaUID,
  data: {
    recipient: "0x0000000000000000000000000000000000000000", // optional
    expirationTime: BigInt(0),
    revocable: true, // Be aware that if your schema is not revocable, this MUST be false
    data: encodedData,
  },
});

const attestation = await tx.wait();

console.log("Transaction submitted:", attestation);
