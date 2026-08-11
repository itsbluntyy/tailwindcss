import { CardForm } from "@/components/card-form";

export const metadata = { title: "Add card" };

export default function NewCardPage() {
  return (
    <div>
      <h2 className="mb-5 text-lg font-bold text-ink-100">Add a card</h2>
      <CardForm />
    </div>
  );
}
