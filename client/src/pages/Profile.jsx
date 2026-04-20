import React, { useState, useEffect } from "react";
import styled from "styled-components"; 
import { useDispatch, useSelector } from "react-redux";
import TextInput from "./TextInput";
import Button from "./Button";
import { updateUserProfile } from "../api";
import { loginSuccess } from "../redux/reducers/userSlice";

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_secondary + '20'};
  border-radius: 14px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "",
    age: currentUser?.age || "",
    gender: currentUser?.gender || "Male",
    weight: currentUser?.weight || "",
    height: currentUser?.height || "",
    dailyCaloriesTarget: currentUser?.dailyCaloriesTarget || 2000,
    goalWeight: currentUser?.goalWeight || "",
    calorieDeficit: currentUser?.calorieDeficit || 500,
  });

  useEffect(() => {
    setProfileData({
      name: currentUser?.name,
      age: currentUser?.age,
      gender: currentUser?.gender,
      weight: currentUser?.weight,
      height: currentUser?.height,
      dailyCaloriesTarget: currentUser?.dailyCaloriesTarget,
      goalWeight: currentUser?.goalWeight,
      calorieDeficit: currentUser?.calorieDeficit,
    });
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: ["age", "weight", "height", "dailyCaloriesTarget", "goalWeight", "calorieDeficit"].includes(name) ? Number(value) : value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem("bodylytics-app-token");
    try {
      const res = await updateUserProfile(token, profileData);
      dispatch(loginSuccess({ ...currentUser, ...res.data }));
      setIsEditMode(false);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Title>User Profile</Title>
      <Form>
        <TextInput
          label="Name"
          name="name"
          value={profileData.name}
          handelChange={handleInputChange}
          disabled={!isEditMode}
        />
        <TextInput
          label="Age"
          name="age"
          type="number"
          value={profileData.age}
          handelChange={handleInputChange}
          disabled={!isEditMode}
        />
        {/* A proper dropdown should be implemented here */}
        <TextInput
          label="Gender"
          name="gender"
          value={profileData.gender}
          handelChange={handleInputChange}
          disabled={!isEditMode}
        />
        <TextInput
          label="Weight (kg)"
          name="weight"
          type="number"
          value={profileData.weight}
          handelChange={handleInputChange}
          disabled={!isEditMode}
        />
        <TextInput
          label="Height (cm)"
          name="height"
          type="number"
          value={profileData.height}
          handelChange={handleInputChange}
          disabled={!isEditMode}
        />
        <TextInput
          label="Daily Calorie Target"
          name="dailyCaloriesTarget"
          type="number"
          value={profileData.dailyCaloriesTarget}
          handelChange={handleInputChange}
          disabled={!isEditMode}
        />
        <TextInput
          label="Goal Weight (kg)"
          name="goalWeight"
          type="number"
          value={profileData.goalWeight}
          handelChange={handleInputChange}
          disabled={!isEditMode}
        />
        <TextInput
          label="Calorie Deficit"
          name="calorieDeficit"
          type="number"
          value={profileData.calorieDeficit}
          handelChange={handleInputChange}
          disabled={!isEditMode}
        />
      </Form>
      <ButtonWrapper>
        {isEditMode ? (
          <Button text="Save" onClick={handleSave} isLoading={loading} small />
        ) : (
          <Button text="Edit Profile" onClick={() => setIsEditMode(true)} small />
        )}
      </ButtonWrapper>
    </Card>
  );
};

export default Profile;