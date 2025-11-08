import { Configurator } from "@/components/configurator";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Configurator />
      </main>
    </div>
  );
}
