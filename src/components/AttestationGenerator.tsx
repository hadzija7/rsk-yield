import { useState } from "react";
import { useAttestation } from "../hooks/useAttestation";
import Button from "./ui/button";
import { useToast } from "./ui/use-toast";

export function AttestationGenerator() {
  const { generateAttestation, isLoading, error, connectedAddress } =
    useAttestation();
  const { toast } = useToast();
  const [statement, setStatement] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      //we should use blockscout ui sdk here to show transaction outcome
      const attestation: any = await generateAttestation({
        statement,
      });

      toast({
        title: "Attestation Generated",
        description: `Transaction hash: ${attestation}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: error || "Failed to generate attestation",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={statement}
        onChange={(e) => setStatement(e.target.value)}
        placeholder="Enter your statement"
        className="w-full p-2 border rounded text-black mt-4"
      />
      <Button
        className="flex justify-center items-center"
        type="submit"
        disabled={isLoading || !connectedAddress}
      >
        {isLoading ? "Generating..." : "Generate Attestation"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
