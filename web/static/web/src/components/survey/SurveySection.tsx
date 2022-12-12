import { Dispatch, SetStateAction } from "react";
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from "@mui/material";

interface SurveySectionProps {
  options: Record<string, any>[];
  optionsKey: string;
  answers: Record<string, any>;
  setAnswers: Dispatch<SetStateAction<Record<string, any>>>;
}

function SurveySection({ optionsKey, options, setAnswers, answers }: SurveySectionProps) {
  const currentAnswer: Record<string, any> | null = answers[optionsKey];

  function handleClick(option: Record<string, any>) {
    setAnswers(ans => ({
      ...ans,
      [optionsKey]: currentAnswer?.id === option.id ? null : option,
    }));
  }

  return (
    <Grid container spacing={2} sx={{ pb: 15 }}>
      {options
        .sort((a, b) => a.name.replace(/[\W_]/gi, "").localeCompare(b.name.replace(/[\W_]/gi, "")))
        .map(opt => (
          <Grid item xs={6} md={4} lg={3} xl={2} key={opt.id}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                borderColor: currentAnswer?.id === opt.id ? "success.main" : undefined,
                backgroundColor: currentAnswer?.id === opt.id ? "background.default" : undefined,
                borderWidth: currentAnswer?.id === opt.id ? 3 : undefined,
              }}
            >
              <CardActionArea sx={{ height: "100%" }} onClick={() => handleClick(opt)}>
                <CardMedia
                  component="img"
                  image={
                    opt.image
                      ? opt.image.startswith("http")
                        ? opt.image
                        : `https://storage.googleapis.com/squad-awards-assets/${opt.image}`
                      : ""
                  }
                />
                <CardContent
                  sx={{
                    display: "flex",
                    placeContent: "center",
                    placeItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2">{opt.name}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
}

export default SurveySection;
