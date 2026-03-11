import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, CheckCircle, AlertCircle, Dna, Gauge, FileText, Printer } from "lucide-react";
import { motion } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";

const PredictionResult = () => {
  const { id } = useParams();
  const [prediction, setPrediction] = useState<Tables<"predictions"> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      const { data } = await supabase.from("predictions").select("*").eq("id", id).single();
      setPrediction(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Prediction not found.</p>
        <Link to="/dashboard"><Button className="mt-4">Back to Dashboard</Button></Link>
      </div>
    );
  }

  const riskIcon = prediction.risk_level === "High" ? AlertTriangle : prediction.risk_level === "Medium" ? AlertCircle : CheckCircle;
  const riskColor = prediction.risk_level === "High" ? "risk-high" : prediction.risk_level === "Medium" ? "risk-medium" : "risk-low";

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Prediction Result</h1>
        <p className="mb-8 text-muted-foreground">
          Patient: {prediction.patient_name} · {new Date(prediction.created_at).toLocaleDateString()}
        </p>
      </motion.div>

      {/* Main result */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <Card className={`mb-6 border-2 shadow-elevated bg-${riskColor}`}>
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            {(() => {
              const Icon = riskIcon;
              return <Icon className={`h-16 w-16 ${riskColor}`} />;
            })()}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
              <p className={`font-display text-4xl font-bold ${riskColor}`}>{prediction.risk_level}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Genotype */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-base">
              <Dna className="h-5 w-5 text-primary" />
              Predicted Genotype
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-bold text-foreground">{prediction.predicted_genotype}</p>
          </CardContent>
        </Card>

        {/* Confidence */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-base">
              <Gauge className="h-5 w-5 text-primary" />
              Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-bold text-foreground">{prediction.confidence}%</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${prediction.confidence}%` }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendation */}
      <Card className="mt-4 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-base">
            <FileText className="h-5 w-5 text-primary" />
            Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">{prediction.recommendation}</p>
        </CardContent>
      </Card>

      {/* Patient Details */}
      <Card className="mt-4 shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-base">Patient Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div><span className="text-muted-foreground">Age:</span> <span className="font-medium text-foreground">{prediction.patient_age}</span></div>
            <div><span className="text-muted-foreground">Gender:</span> <span className="font-medium text-foreground">{prediction.patient_gender}</span></div>
            {prediction.blood_group && <div><span className="text-muted-foreground">Blood Group:</span> <span className="font-medium text-foreground">{prediction.blood_group}</span></div>}
            {prediction.hemoglobin_level && <div><span className="text-muted-foreground">Hemoglobin:</span> <span className="font-medium text-foreground">{prediction.hemoglobin_level} g/dL</span></div>}
            {prediction.rbc_count && <div><span className="text-muted-foreground">RBC:</span> <span className="font-medium text-foreground">{prediction.rbc_count} M/µL</span></div>}
            {prediction.wbc_count && <div><span className="text-muted-foreground">WBC:</span> <span className="font-medium text-foreground">{prediction.wbc_count} K/µL</span></div>}
            {prediction.father_genotype && <div><span className="text-muted-foreground">Father's Genotype:</span> <span className="font-medium text-foreground">{prediction.father_genotype}</span></div>}
            {prediction.mother_genotype && <div><span className="text-muted-foreground">Mother's Genotype:</span> <span className="font-medium text-foreground">{prediction.mother_genotype}</span></div>}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <Link to="/predict" className="flex-1">
          <Button className="w-full">New Prediction</Button>
        </Link>
        <Button variant="outline" onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>
    </div>
  );
};

export default PredictionResult;
