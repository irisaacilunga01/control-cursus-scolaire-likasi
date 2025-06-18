// app/options/add/page.tsx
import { EcoleForm } from "@/components/ecoles-form";

export default function AddEcolePage() {
  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Ajouter une nouvelle école</h2>
      <EcoleForm />
    </div>
  );
}
