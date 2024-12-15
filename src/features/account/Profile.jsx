import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Box,
  ThemeProvider,
  createTheme,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Rating,
  Chip
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import CssBaseline from "@mui/material/CssBaseline";
import zipcodes from 'zipcodes';
import DisplayReviews from '../posts/DisplayReviews';
import axios from 'axios';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

import StreakBadge from './StreakBadge';

dayjs.extend(isoWeek);

const lightTheme = createTheme({
    palette: {
        mode: "light",
        background: {
            paper: "#ffffff",
            default: "#f5f5f5",
        },
        text: {
            primary: "#000000",
        },
    },
});

function Profile() {
    
}

export default Profile;