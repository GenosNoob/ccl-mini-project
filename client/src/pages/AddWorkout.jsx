import React from "react"; // Keep React import
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 24px; /* Adjusted border and shadow for light theme */
  border: 1px solid ${({ theme }) => theme.text_secondary + '20'};
  border-radius: 14px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary}; /* Darker title for light theme */
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;
const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const AddWorkout = ({ newWorkout, setNewWorkout, addNewWorkout, buttonLoading }) => {
  const handleInputChange = (e) => {
    setNewWorkout({ ...newWorkout, [e.target.name]: e.target.value });
  };

  return (
    <Card>
      <Title>Add New Workout</Title>
      <Form>
        <TextInput
          label="Workout Name"
          name="workoutName"
          value={newWorkout.workoutName}
          handelChange={handleInputChange}
          placeholder="e.g., Bench Press"
        />
        <TextInput
          label="Category"
          name="category"
          value={newWorkout.category}
          handelChange={handleInputChange}
          placeholder="e.g., Chest"
        />
        <TextInput
          label="Sets (number)"
          name="sets"
          value={newWorkout.sets}
          handelChange={handleInputChange}
        />
        <TextInput
          label="Reps (number)"
          name="reps"
          value={newWorkout.reps}
          handelChange={handleInputChange}
        />
        <TextInput
          label="Weight (Kg)"
          name="weight"
          value={newWorkout.weight}
          handelChange={handleInputChange}
        />
        <TextInput
          label="Duration (mins)"
          name="duration"
          value={newWorkout.duration}
          handelChange={handleInputChange}
        />
      </Form>
      <Button
        text="Add Workout"
        small
        onClick={() => addNewWorkout()}
        isLoading={buttonLoading}
        isDisabled={buttonLoading}
      />
    </Card>
  );
};

export default AddWorkout;
