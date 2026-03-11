import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, History, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState<Tables<"predictions">[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await supabase
        .from("predictions")
        .select("*")
        .order("created_at", { ascending: false });
      setPredictions(data || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const filtered = predictions.filter(
    (p) =>
      p.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      p.predicted_genotype?.toLowerCase().includes(search.toLowerCase()) ||
      p.risk_level?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Prediction History</h1>
        <p className="mb-8 text-muted-foreground">Browse and search all past predictions</p>
      </motion.div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by patient name, genotype, or risk level..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <History className="h-5 w-5 text-primary" />
            All Predictions ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No predictions found.</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link to={`/result/${p.id}`}>
                    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-secondary">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground">{p.patient_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.patient_age} yrs · {p.patient_gender} · {new Date(p.created_at).toLocaleDateString()}
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
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionHistory;
