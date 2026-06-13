import AdminInterface from "../../src/components/AdminInterface";

export const metadata = {
  title: "Admin | Coast Infrastructure",
  description: "Manage project entries for the Coast Infrastructure website.",
};

export default function AdminPage() {
  return (
    <div className="container py-12">
      <AdminInterface />
    </div>
  );
}
