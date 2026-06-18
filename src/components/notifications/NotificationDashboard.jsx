import { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";

// shadcn components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    pending: 0,
    failed: 0,
  });

  const [recent, setRecent] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecent();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/notifications/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecent = async () => {
    try {
      const res = await axiosInstance.get("/notifications/recent");
      setRecent(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 🔹 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total" value={stats.total} />
        <StatCard title="Sent" value={stats.sent} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Failed" value={stats.failed} />
      </div>

      {/* 🔹 Recent Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scheduled</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {recent.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No campaigns found
                  </TableCell>
                </TableRow>
              ) : (
                recent.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell>{item.scheduled_at}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* 🔹 Stat Card */
function StatCard({ title, value }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

/* 🔹 Status Badge */
function StatusBadge({ status }) {
  const colors = {
    sent: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
