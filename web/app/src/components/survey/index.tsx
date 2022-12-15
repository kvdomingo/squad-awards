import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IosShareRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Container,
  Grid,
  Step,
  StepContent,
  StepContext,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import api from "../../api";
import theme from "../../themes";
import { AwardChoice, GlobalNotificationState, StepInterface, User } from "../../types";
import SurveySection from "./SurveySection";
import SurveySummary from "./SurveySummary";

const STEPS: StepInterface[] = [
  {
    key: "BFSA",
    label: "Best Female Solo Artist",
    type: "artist",
  },
  {
    key: "BMSA",
    label: "Best Male Solo Artist",
    type: "artist",
  },
  {
    key: "BFG",
    label: "Best Female Group",
    type: "artist",
  },
  {
    key: "BMG",
    label: "Best Male Group",
    type: "artist",
  },
  {
    key: "MVOTY",
    label: "Music Video of the Year",
    type: "video",
  },
  {
    key: "ROTY",
    label: "Rookie of the Year",
    type: "artist",
  },
  {
    key: "AOTY",
    label: "Album of the Year",
    type: "album",
  },
  {
    key: "SOTY",
    label: "Song of the Year",
    type: "track",
  },
  {
    key: "BOTY",
    label: "B-Side of the Year",
    type: "track",
  },
  {
    key: "SADGE",
    label: "Sadge of the Year",
    type: "custom",
  },
  {
    key: "SUMMARY",
    label: "Your Summary",
    type: null,
  },
];

interface SurveyProps {
  user: User;
  setUser: Dispatch<SetStateAction<User | null>>;
  setGlobalNotification: Dispatch<SetStateAction<GlobalNotificationState>>;
}

function Survey({ user, setUser, setGlobalNotification }: SurveyProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [choices, setChoices] = useState<AwardChoice[]>([]);
  const [answers, setAnswers] = useState<Record<string, AwardChoice | null>>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  useEffect(() => {
    api.survey
      .listCategories()
      .then(res => {
        let { data } = res;
        const ans_: Record<string, AwardChoice | null> = {};
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

  useEffect(() => {
    if (user.has_answered) {
      api.survey
        .retrieve(user.id)
        .then(res => {
          const { data } = res;
          const ans_ = { ...answers };
          Object.keys(data).forEach(key => {
            ans_[key] = data[key];
          });
          setActiveStep(STEPS.length - 1);
          setAnswers(ans_);
        })
        .catch(err => console.error(err.message));
    }
  }, []);

  function handleSubmit() {
    setSubmitLoading(true);
    api.survey
      .submit(answers)
      .then(() => {
        setGlobalNotification({
          visible: true,
          message: "Your answers have been submitted.",
          severity: "success",
        });
        setUser(user => ({ ...user!, has_answered: true }));
      })
      .catch(err => {
        console.error(err.message);
        setGlobalNotification({
          visible: true,
          message: "An error occurred. Please try again later.",
          severity: "error",
        });
      })
      .finally(() => setSubmitLoading(false));
  }

  function handleDownload() {
    setShareLoading(true);
    const summary = document.querySelector("#surveySummary")! as HTMLElement;
    html2canvas(summary, {
      useCORS: true,
      backgroundColor: theme.palette.background.default,
      onclone: (documentClone, element) => {
        const summaryContainer = element.querySelector("#surveySummaryContainer")! as HTMLElement;
        element.style.padding = `${theme.spacing(3)} 0`;
        element.style.margin = "0";
        summaryContainer.style.padding = theme.spacing(2);
        const title = element.querySelector("#surveyTitle")! as HTMLElement;
        title.textContent = `${user.username}'s 2022 Awards`;
        title.style.display = "block";
      },
      scale: 1.33,
    })
      .then(canvas => {
        canvas.toBlob(async blob => {
          saveAs(await blob!, `${user.username}'s 2022 Awards.png`);
        }, "image/png");
      })
      .finally(() => setShareLoading(false));
  }

  return (
    <Container sx={{ mt: 6 }}>
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ pb: 15 }}>
        {STEPS.map((step, i) => (
          <Step key={step.key} onClick={() => setActiveStep(i)}>
            <StepLabel sx={{ "cursor": "pointer", "& .Mui-disabled": { cursor: "pointer" } }}>
              <Typography variant="h6" component="h1">
                {step.label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Box sx={{ mt: 6, mb: 4 }} id="surveySummary">
                {activeStep === STEPS.length - 1 ? (
                  <>
                    <Typography
                      variant="h5"
                      component="h1"
                      textAlign="center"
                      sx={{ mb: 2, display: "none" }}
                      id="surveyTitle"
                    >
                      Your Summary
                    </Typography>
                    <SurveySummary answers={answers} steps={STEPS} />
                  </>
                ) : (
                  <SurveySection
                    readOnly={user.has_answered}
                    key={STEPS[activeStep].key}
                    step={STEPS[activeStep]}
                    options={choices.filter(c => c.category === STEPS[activeStep].key)}
                    answers={answers}
                    setAnswers={setAnswers}
                  />
                )}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      <Grid
        container
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          pb: 2,
          pt: 4,
          px: 4,
          background:
            "linear-gradient(0deg, rgba(36, 36, 36, 1.0) 0%, rgba(36, 36, 36, 0.85) 67%, rgba(36, 36, 36, 0.0) 100%)",
        }}
      >
        <Grid item container xs>
          {activeStep === STEPS.length - 1 && Object.values(answers).some(Boolean) && (
            <LoadingButton
              loading={shareLoading}
              color="success"
              variant="contained"
              sx={{ mr: 1, borderRadius: 5 }}
              onClick={handleDownload}
              size="large"
              startIcon={<IosShareRounded />}
            >
              Share
            </LoadingButton>
          )}
        </Grid>
        <Grid item container xs justifyContent="flex-end">
          <Button
            variant="outlined"
            sx={{ mr: 1, borderRadius: 5 }}
            onClick={() => setActiveStep(step => (step === 0 ? step : step - 1))}
            disabled={activeStep === 0}
            size="large"
          >
            Back
          </Button>
          <LoadingButton
            type={activeStep === STEPS.length - 1 ? "submit" : undefined}
            variant={activeStep === STEPS.length - 1 ? "contained" : "outlined"}
            onClick={() =>
              activeStep === STEPS.length - 1
                ? handleSubmit()
                : setActiveStep(step => (step === STEPS.length - 1 ? step : step + 1))
            }
            disabled={activeStep === STEPS.length - 1 && (Object.values(answers).every(el => !el) || user.has_answered)}
            size="large"
            loading={submitLoading}
            sx={{ borderRadius: 5 }}
          >
            {activeStep === STEPS.length - 1 ? (user.has_answered ? "Already submitted" : "Submit") : "Next"}
          </LoadingButton>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Survey;
