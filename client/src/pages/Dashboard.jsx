import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { counts } from "../utils/data";
import CountsCard from "../components/cards/CountsCard";
import WeeklyStatCard from "../components/cards/WeeklyStatCard";
import CategoryChart from "../components/cards/CategoryChart";
import { getDashboardDetails } from "../api";
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
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const Title = styled.div`
  padding: 0px 16px;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary}; 
`;
const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Welcome = styled.div`
  padding: 0px 16px;
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 400;
`;

const Dashboard = () => {
  const { currentUser, loginTime } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const dashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem("bodylytics-app-token");
    await getDashboardDetails(token).then((res) => {
      setData(res.data);
      console.log(res.data);
    }).catch((err) => {
      alert(err.response?.data?.message || "Failed to fetch dashboard data.");
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
  };


  useEffect(() => {
    dashboardData();
  }, []);

  // Re-calculate derived values here, after data is fetched.
  const dailyCaloriesTarget = data?.user?.dailyCaloriesTarget || 2000;
  const goalWeight = data?.user?.goalWeight || "N/A";
  const calorieDeficit = data?.user?.calorieDeficit || 0;
  const remainingCaloriesTarget = dailyCaloriesTarget - calorieDeficit;
  const totalCaloriesConsumed = data?.totalCaloriesConsumed || 0;
  const caloriesRemaining = dailyCaloriesTarget - totalCaloriesConsumed;

  return (
    <Container>
      <Wrapper>
        <Title>
          Welcome, {currentUser?.name}
        </Title>
        {loginTime && <Welcome>Login Time: {loginTime}</Welcome>}

        {loading || !data ? (
          <CircularProgress />
        ) : (
          <>
            <FlexWrap>
              <CountsCard
                item={{ ...counts[0], name: "Calories Burned", key: "totalCaloriesBurnt" }}
                data={data}
              />
              <CountsCard
                item={{ name: "Total Workouts", key: "totalWorkouts" }}
                data={data}
              />
              <CountsCard
                item={{ name: "Avg Calories/Workout", key: "avgCaloriesBurntPerWorkout", unit: "kcal" }}
                data={data}
              />
            </FlexWrap>

            <FlexWrap>
              <CountsCard
                item={{ name: "Daily Target", key: "dailyCaloriesTarget", unit: "kcal", desc: "Your daily calorie target" }}
                data={{ dailyCaloriesTarget }}
              />
              <CountsCard
                item={{ name: "Goal Weight", key: "goalWeight", unit: "kg", desc: "Your target weight" }}
                data={{ goalWeight }}
              />
              <CountsCard
                item={{ name: "Calorie Deficit", key: "calorieDeficit", unit: "kcal", desc: "Your target calorie deficit" }}
                data={{ calorieDeficit }}
              />
              <CountsCard
                item={{ name: "Effective Target", key: "effectiveTargetCalories", unit: "kcal", desc: "Daily Target - Deficit" }}
                data={{ effectiveTargetCalories: remainingCaloriesTarget }}
              />
              <CountsCard
                item={{ name: "Calories Consumed", key: "totalCaloriesConsumed", unit: "kcal", desc: "Total calories consumed today" }}
                data={data}
              />
              <CountsCard
                item={{ name: "Calories Remaining", key: "caloriesRemaining", unit: "kcal", desc: "Remaining calories for the day" }}
                data={{ caloriesRemaining }}
              />
            </FlexWrap>

            <FlexWrap>
              <WeeklyStatCard data={data?.totalWeeksStats} />
              <CategoryChart data={data} />
            </FlexWrap>
          </>
        )}
      </Wrapper>
    </Container>
  );
};

export default Dashboard;
