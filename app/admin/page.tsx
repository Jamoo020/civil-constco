import AdminInterface from "../../src/components/AdminInterface";

export const metadata = {
  title: "Admin | Finecone Builders Limited",
  description: "Manage project entries for the Finecone Builders Limited website.",
};

export default function AdminPage() {
  return (
    <div className="container py-12">
      <AdminInterface />
    </div>
  );
}
