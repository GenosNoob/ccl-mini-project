import { ThemeProvider, styled } from "styled-components";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { logout } from "./redux/reducers/userSlice";
import Authentication from "./pages/Authentication";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Tutorials from "./pages/Tutorials";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import ProfilePage from "./pages/ProfilePage";
import MealTracker from "./pages/MealTracker";

const lightTheme = {
  bg: "#F8F9FA", // Very light grey/off-white
  bg_secondary: "#FFFFFF", // Pure white for cards/surfaces
  primary: "#007BFF", // A vibrant blue
  secondary: "#6F42C1", // A rich purple
  text_primary: "#212529", // Dark grey for primary text
  text_secondary: "#6C757D", // Medium grey for secondary text
  card: "#FFFFFF", // White card background
  white: "#FFFFFF",
  black: "#000000",
  green: "#28A745", // Success green
  red: "#DC3545", // Danger red
  yellow: "#FFC107", // Warning yellow
  cyan: "#17A2B8", // Info cyan
};



const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, ${({ theme }) => theme.bg} 0%, ${({ theme }) => theme.bg_secondary} 100%); // Use theme.bg and theme.bg_secondary
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: hidden;
  transition: all 0.2s ease;
`;

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("bodylytics-app-token");
    // If redux state shows a user but there's no token in local storage,
    // it's an inconsistent state. Force a logout to sync up.
    if (currentUser && !token) {
      dispatch(logout());
    }
  }, [currentUser, dispatch]);

  return (
    <ThemeProvider theme={lightTheme}> {/* Switched to lightTheme */}
      <BrowserRouter>
        {currentUser ? (
          <Container>
            <Navbar currentUser={currentUser} />
            <Routes>
              <Route path="/" exact element={<Dashboard />} />
              <Route path="/workouts" exact element={<Workouts />} />
              <Route path="/tutorials" exact element={<Tutorials />} />
              <Route path="/blogs" exact element={<Blogs />} />
              <Route path="/contact" exact element={<Contact />} />
              <Route path="/profile" exact element={<ProfilePage />} />
              <Route path="/meals" exact element={<MealTracker />} />
            </Routes>
          </Container>
        ) : (
          <Container>
            <Authentication />
          </Container>
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
