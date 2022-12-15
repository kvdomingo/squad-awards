import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { AwardChoice, StepInterface } from "../../types";

interface SurveySummaryProps {
  answers: Record<string, AwardChoice | null>;
  steps: StepInterface[];
}

function SurveySummary({ answers, steps }: SurveySummaryProps) {
  return (
    <Grid container spacing={2} id="surveySummaryContainer">
      {Object.keys(answers).map((key: keyof typeof answers) => (
        <Grid item xs={6} md={12 / 5} key={key}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardMedia
              component="img"
              image={
                answers[key]?.image
                  ? answers[key]?.image?.startsWith("http")
                    ? answers[key]!.image!.includes("ytimg.com")
                      ? `/api/youtube/imgProxy?to=${encodeURIComponent(answers[key]!.image!)}`
                      : answers[key]!.image!
                    : `https://storage.googleapis.com/squad-awards-assets/${answers[key]?.image}`
                  : ""
              }
              sx={{
                aspectRatio: "1",
                objectFit: "cover",
              }}
            />
            <CardContent
              sx={{
                display: "flex",
                placeContent: "center",
                placeItems: "center",
                textAlign: "center",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6">{steps.find((s: Record<string, any>) => s.key === key)!.label}</Typography>
              <Typography variant="overline">{answers[key]?.name ?? "None"}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default SurveySummary;
