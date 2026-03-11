import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Database, BarChart3, Shield, Activity, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground">About the System</h1>
        <p className="mb-8 text-muted-foreground">
          Development of Sickle Cell Patient Prediction System Using Machine Learning
        </p>
      </motion.div>

      <div className="space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Activity className="h-5 w-5 text-primary" />
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-foreground">
            <p>
              Sickle Cell Disease (SCD) is a group of inherited red blood cell disorders affecting millions worldwide.
              This system leverages machine learning to predict a patient's likelihood of having sickle cell disease
              based on clinical data, blood parameters, family genotype history, and presenting symptoms.
            </p>
            <p>
              Early prediction and screening are crucial for managing SCD effectively. This tool assists healthcare
              professionals in quickly assessing patient risk and recommending appropriate confirmatory tests.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Brain className="h-5 w-5 text-primary" />
              Machine Learning Model
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-foreground">
            <p>The prediction system uses a supervised machine learning model trained on clinical datasets. Key aspects include:</p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>Classification algorithm (e.g., Random Forest, SVM, or Neural Network)</li>
              <li>Features: blood parameters (Hb, RBC, WBC, MCV, MCH, MCHC), genotype history, symptoms</li>
              <li>Output: Predicted genotype (AA, AS, SS), risk level, and confidence score</li>
              <li>Model trained and validated with cross-validation techniques</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Database className="h-5 w-5 text-primary" />
              Input Parameters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold text-foreground">Blood Parameters</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Hemoglobin Level (g/dL)</li>
                  <li>• Red Blood Cell Count</li>
                  <li>• White Blood Cell Count</li>
                  <li>• Platelet Count</li>
                  <li>• MCV, MCH, MCHC</li>
                  <li>• Hematocrit</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-foreground">Other Factors</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Father's Genotype</li>
                  <li>• Mother's Genotype</li>
                  <li>• Fatigue & Weakness</li>
                  <li>• Joint/Bone Pain</li>
                  <li>• Jaundice</li>
                  <li>• Frequent Infections</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <BarChart3 className="h-5 w-5 text-primary" />
              Output & Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-foreground">
            <p>The system produces the following outputs for each prediction:</p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li><strong>Predicted Genotype:</strong> AA (Normal), AS (Carrier/Trait), SS (Sickle Cell Disease)</li>
              <li><strong>Risk Level:</strong> High, Medium, or Low risk classification</li>
              <li><strong>Confidence Score:</strong> Percentage indicating model's prediction certainty</li>
              <li><strong>Recommendation:</strong> Clinical guidance based on the prediction result</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Shield className="h-5 w-5 text-primary" />
              Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              This system is designed as a screening and decision-support tool and should <strong>not</strong> be used
              as a substitute for professional medical diagnosis. All predictions should be confirmed with
              standard laboratory tests such as hemoglobin electrophoresis. Always consult a qualified
              healthcare professional for medical decisions.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <BookOpen className="h-5 w-5 text-primary" />
              Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="list-inside list-disc space-y-1">
              <li>Frontend: React + TypeScript + Tailwind CSS</li>
              <li>Backend: Lovable Cloud (PostgreSQL, Auth, Storage)</li>
              <li>ML API: Python (Flask/FastAPI) with scikit-learn / TensorFlow</li>
              <li>Deployment: Lovable Platform</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
