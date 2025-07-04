import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarterProps } from "@/lib/types";

export default function StarterCard({
  starter,
}: {
  starter: StarterProps;
}): JSX.Element {
  return (
    <button
      onClick={() => window.open(starter.link, "_blank", "noopener noreferrer")}
    >
      <Card className="hover:border-primary/70 transition-all hover:opacity-80">
        <CardHeader>
          <CardTitle>{starter.name}</CardTitle>
          <CardDescription className="line-clamp-3">
            {starter.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </button>
  );
}
