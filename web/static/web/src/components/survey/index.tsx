import { useEffect, useState } from "react";
import { Box, Button, Grid, Step, StepLabel, Stepper, Typography } from "@mui/material";
import api from "../../api";
import SurveySection from "./SurveySection";
import SurveySummary from "./SurveySummary";

const STEPS = [
  {
    key: "BFSA",
    label: "Best Female Solo Artist",
  },
  {
    key: "BMSA",
    label: "Best Male Solo Artist",
  },
  {
    key: "BFG",
    label: "Best Female Group",
  },
  {
    key: "BMG",
    label: "Best Male Group",
  },
  {
    key: "MVOTY",
    label: "Music Video of the Year",
  },
  {
    key: "ROTY",
    label: "Rookie of the Year",
  },
  {
    key: "AOTY",
    label: "Album of the Year",
  },
  {
    key: "SOTY",
    label: "Song of the Year",
  },
  {
    key: "BOTY",
    label: "B-Side of the Year",
  },
  {
    key: "SADGE",
    label: "Sadge of the Year",
  },
  {
    key: "SUMMARY",
    label: "Your Summary",
  },
];

function Survey() {
  const [activeStep, setActiveStep] = useState(0);
  const [categories, setCategories] = useState<Record<string, any>[]>([]);
  const [choices, setChoices] = useState<Record<string, any>[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    api.survey
      .listCategories()
      .then(res => {
        let { data } = res;
        setCategories(data);
        const ans_: Record<string, any> = {};
        data.forEach((dat: Record<string, any>) => (ans_[dat.key] = null));
        setAnswers(ans_);
      })
      .catch(err => console.error(err.message));
  }, []);

  useEffect(() => {
    api.survey
      .listChoices()
      .then(res => setChoices(res.data))
      .catch(err => console.error(err.message));
  }, []);

  return (
    <Box sx={{ width: "100%", mt: 6 }}>
      <Stepper activeStep={activeStep}>
        {STEPS.map((step, i) => (
          <Step
            key={step.key}
            onClick={() => setActiveStep(i)}
            sx={{ "cursor": "pointer", "& .Mui-disabled": { cursor: "pointer" } }}
          >
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Typography variant="h4" component="h1" textAlign="center" sx={{ my: 4 }}>
        {STEPS[activeStep].label}
      </Typography>
      {activeStep === STEPS.length - 1 ? (
        <SurveySummary answers={answers} steps={STEPS} />
      ) : (
        <SurveySection
          optionsKey={STEPS[activeStep].key}
          options={choices.filter(c => c.category === STEPS[activeStep].key)}
          answers={answers}
          setAnswers={setAnswers}
        />
      )}
      <Grid
        container
        justifyContent="center"
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          pb: 2,
          pt: 4,
          background:
            "linear-gradient(0deg, rgba(36, 36, 36, 1.0) 0%, rgba(36, 36, 36, 0.85) 67%, rgba(36, 36, 36, 0.0) 100%)",
        }}
      >
        <Button
          variant="outlined"
          sx={{ mr: 2 }}
          onClick={() => setActiveStep(step => (step === 0 ? step : step - 1))}
          disabled={activeStep === 0}
        >
          Back
        </Button>
        <Button
          variant={activeStep === STEPS.length - 1 ? "contained" : "outlined"}
          onClick={() => setActiveStep(step => (step === STEPS.length - 1 ? step : step + 1))}
          disabled={activeStep === STEPS.length - 1 && Object.values(answers).every(el => !el)}
        >
          {activeStep === STEPS.length - 1 ? "Submit" : "Next"}
        </Button>
      </Grid>
    </Box>
  );
}

export default Survey;
