import React from 'react';
import { Chip } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

const StreakBadge = ({ reviewStreak }) => {
  const getBadgeColor = () => {
    if (reviewStreak === 0) return "error";
    return "success";
  };
    
  const getStreakColor = () => {
    if (reviewStreak === 0) return "#f44336";
    return "#4caf50";
  };


  const getStreakIcon = () => {
    const color = getBadgeColor();

    if (reviewStreak === 0) return <SentimentDissatisfiedIcon color={color} />;
    if (reviewStreak === 1) return <SentimentSatisfiedIcon color={color} />;
    if (reviewStreak > 1 && reviewStreak <= 4) return <SentimentSatisfiedAltIcon color={color} />;
    if (reviewStreak > 4) return <InsertEmoticonIcon color={color} />;
  };

  const getStreakLabel = () => {
    if (reviewStreak === 0) return "No Streak";
    return `${reviewStreak} ${reviewStreak === 1 ? "Week Streak!" : "Weeks Streak!"}`;
  };

  return (
    <Chip
      icon={getStreakIcon()}
      label={getStreakLabel()}
      variant="outlined"
      sx={{
        fontWeight: "bold",
        color: getStreakColor(),
        borderColor: getStreakColor(),
      }}
    />
  );
};

export default StreakBadge;