import React, { useEffect, useState } from "react";
import styled from "styled-components"; 
import { addMeal, getMeals } from "../api";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
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
  padding: 0px 16px;
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: 22px;
  color: ${({ theme }) => theme.primary};
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px; /* Adjusted border and shadow for light theme */
  border: 1px solid ${({ theme }) => theme.text_secondary + '20'};
  border-radius: 14px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 600px;
`;

const MealList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

const MealItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px; /* White background for meal items */
  background: ${({ theme }) => theme.bg_secondary};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary + '20'}; /* Lighter border */
`;

const MealInfo = styled.div`
  color: ${({ theme }) => theme.text_primary};
`;

const MealTracker = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [newMeal, setNewMeal] = useState({
    mealName: "",
    quantity: 1,
    calories: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeal({
      ...newMeal,
      [name]: name === "quantity" || name === "calories" ? Number(value) : value,
    });
  };

  const fetchMeals = async () => {
    setLoading(true);
    const token = localStorage.getItem("bodylytics-app-token");
    await getMeals(token, "")
      .then((res) => {
        setMeals(res.data);
        setLoading(false);
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to fetch meals");
        setLoading(false);
      });
  };

  const handleAddMeal = async () => {
    if (!newMeal.mealName || !newMeal.quantity || !newMeal.calories) {
      alert("Please fill all fields");
      return;
    }
    setButtonLoading(true);
    const token = localStorage.getItem("bodylytics-app-token");
    await addMeal(token, newMeal)
      .then(() => {
        fetchMeals(); // Refetch meals to update the list
        setNewMeal({ mealName: "", quantity: 1, calories: 0 });
        setButtonLoading(false);
      })
      .catch((err) => {
        alert(err.response?.data?.message || err.message || "Failed to add meal");
        setButtonLoading(false);
      });
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <Container>
      <Wrapper>
        <Title>Meal Tracker</Title>
        <Form>
          <TextInput
            label="Meal Name"
            name="mealName"
            value={newMeal.mealName}
            handelChange={handleInputChange}
            placeholder="e.g., Chicken Salad"
          />
          <TextInput
            label="Quantity (grams)"
            name="quantity"
            type="number"
            value={newMeal.quantity}
            handelChange={handleInputChange}
          />
          <TextInput
            label="Calories"
            name="calories"
            type="number"
            value={newMeal.calories}
            handelChange={handleInputChange}
          />
          <Button text="Add Meal" onClick={handleAddMeal} isLoading={buttonLoading} />
        </Form>
        <MealList>
          <h2>Today's Meals</h2>
          {loading ? (
            <CircularProgress />
          ) : (
            meals.map((meal) => (
              <MealItem key={meal._id}>
                <MealInfo>{meal.mealName} ({meal.quantity}g)</MealInfo>
                <MealInfo>{meal.calories} kcal</MealInfo>
              </MealItem>
            ))
          )}
        </MealList>
      </Wrapper>
    </Container>
  );
};

export default MealTracker;