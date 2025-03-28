import AdminRoleSearch from '../components/AdminRoleSearch';

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Add the search component */}
      <AdminRoleSearch />
    </div>
  );
}
