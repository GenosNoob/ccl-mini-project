import React, { useCallback, useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import WorkoutCard from "../components/cards/WorkoutCard";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers";
import { addWorkout, deleteWorkout, getWorkouts } from "../api";
import AddWorkout from "../components/AddWorkout";
import { CircularProgress } from "@mui/material";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;
const Wrapper = styled.div`
  flex: 1;
  max-width: 1600px;
  display: flex;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
    flex-direction: column;
  }
`;
const Left = styled.div`
  flex: 0.2;
  height: fit-content;
  padding: 24px; /* Adjusted border and shadow for light theme */
  border: 1px solid ${({ theme }) => theme.text_secondary + '20'};
  border-radius: 14px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;
const Right = styled.div`
  flex: 1;
`;
const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const SecTitle = styled.div`
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary}; /* Darker title for light theme */
  font-weight: 500;
`;

const AddWorkoutSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 0px 16px;
  margin-top: 22px;
`;


const Workouts = () => {
  const theme = useTheme(); // Re-add this line to define 'theme'
  const [todaysWorkouts, setTodaysWorkouts] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");

  const [newWorkout, setNewWorkout] = useState({
    category: "Legs",
    workoutName: "Back Squat",
    sets: 5,
    reps: 15,
    weight: 30,
    duration: 10,
  });
  const getTodaysWorkout = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("bodylytics-app-token");
    await getWorkouts(token, date ? `?date=${date}` : "").then((res) => {
      setTodaysWorkouts(res?.data?.todaysWorkouts);
      console.log(res.data);
      setLoading(false);
    });
  }, [date]);

  const [buttonLoading, setButtonLoading] = useState(false);

  const addNewWorkout = async () => {
    setButtonLoading(true);
    const token = localStorage.getItem("bodylytics-app-token");
    await addWorkout(token, { ...newWorkout, date: new Date() })
      .then((res) => {
        getTodaysWorkout(); // Refresh the workout list
        setButtonLoading(false);
        setNewWorkout({ category: "Legs", workoutName: "Back Squat", sets: 5, reps: 15, weight: 30, duration: 10 }); // Reset form
      })
      .catch((err) => {
        alert(err.response?.data?.message || err.message || "Failed to add workout");
        setButtonLoading(false);
      });
  };

  const handleDeleteWorkout = async (id) => {
    const token = localStorage.getItem("bodylytics-app-token");
    await deleteWorkout(token, id).then(() => {
        setTodaysWorkouts(todaysWorkouts.filter((workout) => workout._id !== id));
    }).catch((err) => {
        alert(err.response?.data?.message || "Failed to delete workout");
    });
};

  useEffect(() => {
    getTodaysWorkout();
  }, [date, getTodaysWorkout]);
  return (
    <Container>
      <Wrapper>
        <Left>
          <Title>Select Date</Title>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              onChange={(e) => setDate(`${e.$M + 1}/${e.$D}/${e.$y}`)}
              sx={{
                "& .MuiPickersDay-root": {
                  color: theme.text_primary, /* Darker text for light theme */
                },
                "& .MuiPickersDay-root.Mui-selected": {
                  backgroundColor: theme.primary, /* Keep accent color */
                  color: theme.white, /* Keep white text on accent */
                  "&:hover": {
                    backgroundColor: theme.primary, /* Keep accent color */
                  },
                },
                "& .MuiDayCalendar-weekDayLabel": {
                  color: theme.text_secondary, /* Darker text for light theme */
                },
              }}
            />
          </LocalizationProvider>
        </Left>
        <Right>
          <Section>
            <SecTitle>Todays Workout</SecTitle>
            {loading ? (
              <CircularProgress />
            ) : (
              <CardWrapper>
                {todaysWorkouts.map((workout) => (
                  <WorkoutCard key={workout._id} workout={workout} onDelete={handleDeleteWorkout} />
                ))}
              </CardWrapper>
            )}
            <AddWorkoutSection>
              <SecTitle>Add New Workout</SecTitle>
              <AddWorkout
                newWorkout={newWorkout}
                setNewWorkout={setNewWorkout}
                addNewWorkout={addNewWorkout}
                buttonLoading={buttonLoading}
              />
            </AddWorkoutSection>
          </Section>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Workouts;
