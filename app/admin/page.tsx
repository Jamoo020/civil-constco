import AdminInterface from "../../src/components/AdminInterface";

export const metadata = {
  title: "Admin | Finecon Builders Limited",
  description: "Manage project entries for the Finecon Builders Limited website.",
};

export default function AdminPage() {
  return (
    <div className="container py-12">
      <AdminInterface />
    </div>
  );
}
