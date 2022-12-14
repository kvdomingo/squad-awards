import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import api from "../../api";
import { AwardChoice, SpotifyAlbumItem, SpotifyArtistItem, SpotifyTrackItem, StepInterface } from "../../types";

interface SurveySectionProps {
  readOnly: boolean;
  step: StepInterface;
  options: AwardChoice[];
  answers: Record<string, AwardChoice | null>;
  setAnswers: Dispatch<SetStateAction<Record<string, AwardChoice | null>>>;
}

function SurveySection({ readOnly, step, options, setAnswers, answers }: SurveySectionProps) {
  const [autocompleteInput, setAutocompleteInput] = useState("");
  const [autocompleteOptions, setAutocompleteOptions] = useState<typeof options>([]);
  const [autocompleteIsOpen, setAutocompleteIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setAutocompleteInput(answers[step.key]?.name ?? "");
  }, [step.key]);

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (autocompleteInput.length > 0 && autocompleteIsOpen) {
      searchDebounceRef.current = setTimeout(() => {
        setLoading(true);
        switch (step.type) {
          case "artist":
          case "album":
          case "track": {
            api.search
              .spotify(step.type, autocompleteInput)
              .then(res => {
                const { data } = res;
                const { items } = Object.values(data)[0];
                setAutocompleteOptions(
                  items.map((it: SpotifyTrackItem | SpotifyAlbumItem | SpotifyArtistItem) => ({
                    id: it.id,
                    name: it.name,
                    image: "images" in it ? it.images[0]?.url ?? null : it.album.images?.[0]?.url ?? null,
                    category: step.key,
                  })),
                );
              })
              .catch(err => console.error(err.message))
              .finally(() => setLoading(false));
            break;
          }
          case "video": {
            api.search
              .youtube(autocompleteInput)
              .then(res =>
                setAutocompleteOptions(
                  res.data.items.map(it => ({
                    id: it.id.videoId,
                    name: it.snippet.title.replace(/&#(\d{1,3});/gi, (match, numStr) =>
                      String.fromCharCode(parseInt(numStr, 10)),
                    ),
                    image: it.snippet.thumbnails.high.url,
                    category: step.key,
                  })),
                ),
              )
              .catch(err => console.error(err.message))
              .finally(() => setLoading(false));
            break;
          }
        }
      }, 500);
    } else {
      setAutocompleteOptions([]);
    }
  }, [autocompleteInput]);

  function handleClick(option: AwardChoice) {
    setAnswers(ans => ({
      ...ans,
      [step.key]: answers[step.key]?.id === option.id ? null : option,
    }));
  }

  return (
    <Grid container spacing={2} sx={{ pb: 15 }}>
      {["artist", "album", "track", "video"].includes(step.type ?? "") ? (
        <Container maxWidth="md">
          <Autocomplete
            readOnly={readOnly}
            disabled={readOnly}
            open={autocompleteIsOpen}
            onOpen={() => setAutocompleteIsOpen(true)}
            onClose={() => setAutocompleteIsOpen(false)}
            options={autocompleteOptions}
            getOptionLabel={option => option.name}
            filterOptions={x => x}
            autoComplete
            filterSelectedOptions
            inputValue={autocompleteInput}
            value={answers[step.key]}
            onChange={(e, value) => setAnswers(ans => ({ ...ans, [step.key]: value }))}
            onInputChange={(e, value) => setAutocompleteInput(value)}
            renderInput={params => (
              <TextField
                {...params}
                label={`Search for ${step.type}`}
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: !!answers[step.key]?.image ? (
                    <Box
                      component="img"
                      src={answers[step.key]?.image ?? ""}
                      width={50}
                      sx={{ aspectRatio: "1", borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    params.InputProps.startAdornment
                  ),
                  endAdornment: loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    params.InputProps.endAdornment
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <ListItemAvatar>
                  <Box
                    component="img"
                    src={option?.image ?? ""}
                    width={100}
                    sx={{ aspectRatio: "1", borderRadius: "50%", mr: 1, objectFit: "cover" }}
                  />
                </ListItemAvatar>
                <ListItemText>{option.name}</ListItemText>
              </li>
            )}
          />
        </Container>
      ) : (
        options
          .sort((a, b) => a.name.replace(/[\W_]/gi, "").localeCompare(b.name.replace(/[\W_]/gi, "")))
          .map(opt => (
            <Grid item xs={6} md={4} lg={3} xl={2} key={opt.id}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderColor: answers[step.key]?.id === opt.id ? "success.main" : undefined,
                  backgroundColor: answers[step.key]?.id === opt.id ? "background.default" : undefined,
                  borderWidth: answers[step.key]?.id === opt.id ? 3 : undefined,
                }}
              >
                <CardActionArea disabled={readOnly} sx={{ height: "100%" }} onClick={() => handleClick(opt)}>
                  <CardMedia
                    component="img"
                    image={
                      opt.image
                        ? opt.image.startsWith("http")
                          ? opt.image
                          : `https://storage.googleapis.com/squad-awards-assets/${opt.image}`
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
                    }}
                  >
                    <Typography variant="body2">{opt.name}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
      )}
    </Grid>
  );
}

export default SurveySection;
