import { StarterProps } from "@/lib/types";
import StarterCard from "./StarterCard";

export default function Starters(): JSX.Element {
  return (
    <section className="mx-auto" id="starters">
      <header className="text-center">
        <p className="text-white/70">Useful Resources</p>
        <h2 className="text-3xl font-bold">Dive into attestations</h2>
      </header>
      <div className="container mx-auto my-12 grid grid-cols-1 gap-6 md:grid-cols-2 max-w-3xl">
        {starters.map((starter) => (
          <StarterCard key={starter.name} starter={starter} />
        ))}
      </div>
    </section>
  );
}

const starters: StarterProps[] = [
  {
    name: "Pitch Deck",
    description:
      "There is a gap between traditional credit market and DeFi, leading to bad capital utilisation in lending protocols.",
    link: "https://www.canva.com/design/DAGpB3Lvkjs/gLN2ZqovYfvph8F0og2lpg/edit?utm_content=DAGpB3Lvkjs&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    name: "Demo Video",
    description:
      "Check out attestation service in action, and understand its value",
    link: "",
  },
];
