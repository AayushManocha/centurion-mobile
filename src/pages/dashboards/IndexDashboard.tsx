import AuthenticatedRoute from "../../components/AuthenticatedRoute";
import MonthlyDashboard from "../../components/dashboards/MonthlyDashboard";
import WeeklyDashboard from "../../components/dashboards/WeeklyDashboard";

function IndexDashboard() {
  return (
    <div>
      <WeeklyDashboard />
      <MonthlyDashboard />
    </div>
  );
}

export default function AuthenticatedIndexDashboard() {
  return (
    <AuthenticatedRoute>
      <IndexDashboard />
    </AuthenticatedRoute>
  );
}