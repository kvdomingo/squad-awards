import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";

interface SurveySummaryProps {
  answers: Record<string, any>;
  steps: Record<string, any>;
}

function SurveySummary({ answers, steps }: SurveySummaryProps) {
  return (
    <Grid container spacing={2} sx={{ pb: 15 }}>
      {Object.keys(answers).map(key => (
        <Grid item xs={6} md={12 / 5} key={key}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardMedia
              component="img"
              image={
                answers[key]?.image
                  ? answers[key].image.startswith("http")
                    ? answers[key].image
                    : `https://storage.googleapis.com/squad-awards-assets/${answers[key].image}`
                  : ""
              }
              // alt={opt.label}
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
              <Typography variant="overline">{answers[key]?.label ?? "None"}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default SurveySummary;
