import { useWallets } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { useState } from "react";

// Constants
const EAS_CONTRACT_ADDRESS = "0xc300aeeadd60999933468738c9f5d7e9c0671e1c"; // Testnet
const SCHEMA_UID =
  "0xf58b8b212ef75ee8cd7e8d803c37c03e0519890502d5e99ee2412aae1456cafe";

interface AttestationData {
  statement: string;
  recipient?: string;
  expirationTime?: bigint;
  revocable?: boolean;
}

// export function clientToSigner(client: Client<Transport, Chain, Account>) {
//   const { account, chain, transport } = client;
//   const network = {
//     chainId: chain.id,
//     name: chain.name,
//     ensAddress: chain.contracts?.ensRegistry?.address,
//   };
//   const provider = new ethers.providers.BaseProvider(transport, network);
//   const signer = new JsonRpcSigner(provider, account.address);
//   return signer;
// }

// export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
//   const { data: client } = useConnectorClient<Config>({ chainId });
//   return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
// }

class SignerWrapper {
  constructor(private signer: ethers.providers.JsonRpcSigner) {}

  async getAddress(): Promise<string> {
    return await this.signer.getAddress();
  }

  async signMessage(message: string | Uint8Array): Promise<string> {
    return await this.signer.signMessage(message);
  }

  async sendTransaction(transaction: any): Promise<any> {
    return await this.signer.sendTransaction(transaction);
  }

  connect(provider: any): SignerWrapper {
    return new SignerWrapper(this.signer.connect(provider));
  }

  // Add the missing methods required by TransactionSigner
  async estimateGas(transaction: any): Promise<bigint> {
    return (await this.signer.estimateGas(transaction)).toBigInt();
  }

  async call(transaction: any): Promise<string> {
    return await this.signer.provider.call(transaction);
  }

  async resolveName(name: string): Promise<string | null> {
    return await this.signer.provider.resolveName(name);
  }

  // Add provider property that EAS might need
  get provider() {
    return this.signer.provider;
  }
}

export function useAttestation() {
  const { wallets } = useWallets();
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAttestation = async (attestationData: AttestationData) => {
    try {
      setIsLoading(true);
      setError(null);

      const wallet = wallets[0];
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      const provider = await wallet.getEthersProvider();
      if (!provider) {
        throw new Error("No wallet connected");
      }

      const signer = provider.getSigner();

      const wrappedSigner = new SignerWrapper(signer);

      // Initialize EAS with the signer
      const eas = new EAS(EAS_CONTRACT_ADDRESS);
      eas.connect(wrappedSigner);

      // Encode the attestation data
      const encoder = new SchemaEncoder("string statement");
      const encodedData = encoder.encodeData([
        { name: "statement", value: attestationData.statement, type: "string" },
      ]);

      // Make the attestation
      const tx = await eas.attest({
        schema: SCHEMA_UID,
        data: {
          recipient:
            attestationData.recipient ||
            "0x0000000000000000000000000000000000000000",
          expirationTime: attestationData.expirationTime || BigInt(0),
          revocable: attestationData.revocable ?? true,
          data: encodedData,
        },
      });

      const attestation = await tx.wait();
      return attestation;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate attestation",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateAttestation,
    isLoading,
    error,
    connectedAddress: address,
  };
}
