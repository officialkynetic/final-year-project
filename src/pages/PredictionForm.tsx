import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User, Droplets, Users, Stethoscope, Loader2 } from "lucide-react";

const PredictionForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    patient_name: "",
    patient_age: "",
    patient_gender: "",
    blood_group: "",
    hemoglobin_level: "",
    rbc_count: "",
    wbc_count: "",
    platelet_count: "",
    mcv: "",
    mch: "",
    mchc: "",
    hematocrit: "",
    father_genotype: "",
    mother_genotype: "",
    has_fatigue: false,
    has_joint_pain: false,
    has_jaundice: false,
    has_swelling: false,
    has_frequent_infections: false,
    has_delayed_growth: false,
  });

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // Call ML API - replace with your actual endpoint
      const mlApiUrl = import.meta.env.VITE_ML_API_URL;
      let predicted_genotype = "AS";
      let risk_level = "Medium";
      let confidence = 75;
      let recommendation = "Consider confirmatory hemoglobin electrophoresis test.";

      if (mlApiUrl) {
        const response = await fetch(`${mlApiUrl}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            age: Number(form.patient_age),
            gender: form.patient_gender,
            blood_group: form.blood_group,
            hemoglobin: Number(form.hemoglobin_level),
            rbc: Number(form.rbc_count),
            wbc: Number(form.wbc_count),
            platelets: Number(form.platelet_count),
            mcv: Number(form.mcv),
            mch: Number(form.mch),
            mchc: Number(form.mchc),
            hematocrit: Number(form.hematocrit),
            father_genotype: form.father_genotype,
            mother_genotype: form.mother_genotype,
            fatigue: form.has_fatigue,
            joint_pain: form.has_joint_pain,
            jaundice: form.has_jaundice,
            swelling: form.has_swelling,
            frequent_infections: form.has_frequent_infections,
            delayed_growth: form.has_delayed_growth,
          }),
        });
        const result = await response.json();
        predicted_genotype = result.genotype || predicted_genotype;
        risk_level = result.risk_level || risk_level;
        confidence = result.confidence || confidence;
        recommendation = result.recommendation || recommendation;
      } else {
        // Simulated prediction based on parent genotypes when no ML API
        const fatherG = form.father_genotype;
        const motherG = form.mother_genotype;
        if (fatherG === "SS" || motherG === "SS") {
          predicted_genotype = "SS";
          risk_level = "High";
          confidence = 88;
          recommendation = "High risk detected. Immediate hemoglobin electrophoresis test recommended.";
        } else if (fatherG === "AS" && motherG === "AS") {
          predicted_genotype = "AS/SS";
          risk_level = "High";
          confidence = 72;
          recommendation = "Both parents carry sickle cell trait. Confirmatory test strongly recommended.";
        } else if (fatherG === "AS" || motherG === "AS") {
          predicted_genotype = "AS";
          risk_level = "Medium";
          confidence = 78;
          recommendation = "One parent carries sickle cell trait. Consider hemoglobin electrophoresis test.";
        } else {
          predicted_genotype = "AA";
          risk_level = "Low";
          confidence = 92;
          recommendation = "Low risk. Normal hemoglobin pattern expected. Routine checkup recommended.";
        }

        // Adjust based on hemoglobin
        const hb = Number(form.hemoglobin_level);
        if (hb && hb < 8) {
          risk_level = "High";
          confidence = Math.min(confidence + 5, 95);
        }
      }

      const { data, error } = await supabase
        .from("predictions")
        .insert({
          user_id: user.id,
          patient_name: form.patient_name,
          patient_age: Number(form.patient_age),
          patient_gender: form.patient_gender,
          blood_group: form.blood_group || null,
          hemoglobin_level: form.hemoglobin_level ? Number(form.hemoglobin_level) : null,
          rbc_count: form.rbc_count ? Number(form.rbc_count) : null,
          wbc_count: form.wbc_count ? Number(form.wbc_count) : null,
          platelet_count: form.platelet_count ? Number(form.platelet_count) : null,
          mcv: form.mcv ? Number(form.mcv) : null,
          mch: form.mch ? Number(form.mch) : null,
          mchc: form.mchc ? Number(form.mchc) : null,
          hematocrit: form.hematocrit ? Number(form.hematocrit) : null,
          father_genotype: form.father_genotype || null,
          mother_genotype: form.mother_genotype || null,
          has_fatigue: form.has_fatigue,
          has_joint_pain: form.has_joint_pain,
          has_jaundice: form.has_jaundice,
          has_swelling: form.has_swelling,
          has_frequent_infections: form.has_frequent_infections,
          has_delayed_growth: form.has_delayed_growth,
          predicted_genotype,
          risk_level,
          confidence,
          recommendation,
        })
        .select()
        .single();

      if (error) throw error;
      toast.success("Prediction completed!");
      navigate(`/result/${data.id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const genotypes = ["AA", "AS", "SS", "AC", "SC"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground">New Prediction</h1>
        <p className="mb-8 text-muted-foreground">Enter patient data for sickle cell risk analysis</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Info */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <User className="h-5 w-5 text-primary" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Patient Name *</Label>
              <Input value={form.patient_name} onChange={(e) => updateField("patient_name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Age *</Label>
              <Input type="number" value={form.patient_age} onChange={(e) => updateField("patient_age", e.target.value)} required min={0} max={150} />
            </div>
            <div className="space-y-2">
              <Label>Gender *</Label>
              <Select value={form.patient_gender} onValueChange={(v) => updateField("patient_gender", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Blood Parameters */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Droplets className="h-5 w-5 text-primary" />
              Blood Parameters
            </CardTitle>
            <CardDescription>Enter available blood test results</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { key: "blood_group", label: "Blood Group", type: "select", options: bloodGroups },
              { key: "hemoglobin_level", label: "Hemoglobin (g/dL)", type: "number" },
              { key: "rbc_count", label: "RBC Count (M/µL)", type: "number" },
              { key: "wbc_count", label: "WBC Count (K/µL)", type: "number" },
              { key: "platelet_count", label: "Platelet Count (K/µL)", type: "number" },
              { key: "hematocrit", label: "Hematocrit (%)", type: "number" },
              { key: "mcv", label: "MCV (fL)", type: "number" },
              { key: "mch", label: "MCH (pg)", type: "number" },
              { key: "mchc", label: "MCHC (g/dL)", type: "number" },
            ].map((field) => (
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>
                {field.type === "select" ? (
                  <Select value={(form as Record<string, string>)[field.key]} onValueChange={(v) => updateField(field.key, v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {field.options?.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="number"
                    step="0.01"
                    value={(form as unknown as Record<string, string>)[field.key]}
                    onChange={(e) => updateField(field.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Family History */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Users className="h-5 w-5 text-primary" />
              Family Genotype History
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Father's Genotype</Label>
              <Select value={form.father_genotype} onValueChange={(v) => updateField("father_genotype", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {genotypes.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Mother's Genotype</Label>
              <Select value={form.mother_genotype} onValueChange={(v) => updateField("mother_genotype", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {genotypes.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Symptoms */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Stethoscope className="h-5 w-5 text-primary" />
              Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {[
              { key: "has_fatigue", label: "Fatigue / Weakness" },
              { key: "has_joint_pain", label: "Joint / Bone Pain" },
              { key: "has_jaundice", label: "Jaundice (Yellow Eyes/Skin)" },
              { key: "has_swelling", label: "Swelling in Hands/Feet" },
              { key: "has_frequent_infections", label: "Frequent Infections" },
              { key: "has_delayed_growth", label: "Delayed Growth" },
            ].map((symptom) => (
              <div key={symptom.key} className="flex items-center gap-3">
                <Checkbox
                  id={symptom.key}
                  checked={(form as unknown as Record<string, boolean>)[symptom.key]}
                  onCheckedChange={(checked) => updateField(symptom.key, !!checked)}
                />
                <Label htmlFor={symptom.key} className="cursor-pointer">{symptom.label}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Run Prediction"
          )}
        </Button>
      </form>
    </div>
  );
};

export default PredictionForm;
