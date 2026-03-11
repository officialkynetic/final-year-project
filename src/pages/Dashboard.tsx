import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus, History, Activity, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";

const Dashboard = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<Tables<"predictions">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      const { data } = await supabase
        .from("predictions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      setPredictions(data || []);
      setLoading(false);
    };
    fetchPredictions();
  }, []);

  const total = predictions.length;
  const highRisk = predictions.filter((p) => p.risk_level === "High").length;
  const lowRisk = predictions.filter((p) => p.risk_level === "Low").length;

  const stats = [
    { label: "Total Predictions", value: total, icon: Activity, color: "text-primary" },
    { label: "High Risk", value: highRisk, icon: AlertTriangle, color: "text-risk-high" },
    { label: "Low Risk", value: lowRisk, icon: CheckCircle, color: "text-risk-low" },
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mb-8 text-muted-foreground">
          Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
        </p>
      </motion.div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="shadow-card">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-lg bg-secondary p-3">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Link to="/predict">
          <Card className="cursor-pointer shadow-card transition-shadow hover:shadow-elevated">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-primary/10 p-3">
                <FilePlus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">New Prediction</h3>
                <p className="text-sm text-muted-foreground">Enter patient data for analysis</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/history">
          <Card className="cursor-pointer shadow-card transition-shadow hover:shadow-elevated">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-primary/10 p-3">
                <History className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">View History</h3>
                <p className="text-sm text-muted-foreground">Browse all past predictions</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent predictions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <TrendingUp className="h-5 w-5 text-primary" />
            Recent Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : predictions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No predictions yet.{" "}
              <Link to="/predict" className="text-primary hover:underline">Make your first prediction</Link>
            </p>
          ) : (
            <div className="space-y-3">
              {predictions.map((p) => (
                <Link key={p.id} to={`/result/${p.id}`} className="block">
                  <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-secondary">
                    <div>
                      <p className="font-medium text-foreground">{p.patient_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-sm font-semibold text-foreground">
                        {p.predicted_genotype}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          p.risk_level === "High"
                            ? "bg-risk-high text-risk-high"
                            : p.risk_level === "Medium"
                            ? "bg-risk-medium text-risk-medium"
                            : "bg-risk-low text-risk-low"
                        }`}
                      >
                        {p.risk_level}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
