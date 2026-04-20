import React from "react";
import styled from "styled-components";

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
const Title = styled.div`
  font-weight: 600;
  font-size: 22px;
  color: ${({ theme }) => theme.primary};
`;
const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 100px;
`;
const Card = styled.div`
  flex: 1;
  min-width: 280px;
  max-width: 400px;
  padding: 16px; /* Adjusted border and shadow for light theme */
  border: 1px solid ${({ theme }) => theme.text_secondary + '20'};
  border-radius: 14px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const VideoFrame = styled.iframe`
  width: 100%;
  height: 180px;
  border-radius: 10px;
  border: none;
`;
const Desc = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary}; /* Darker text for light theme */
`;

const dummyTutorials = [
  { id: 1, title: "20 Min Full Body Workout", desc: "No-jump, apartment-friendly HIIT.", link: "https://www.youtube.com/embed/gC_L9qAHVJ8" },
  { id: 2, title: "15 MIN BEGINNER YOGA", desc: "A relaxing flow to improve flexibility.", link: "https://www.youtube.com/embed/s2NQhpFGIOg" },
  { id: 3, title: "10-Minute Ab Workout", desc: "A quick and effective core routine.", link: "https://www.youtube.com/embed/8PwoytUU01I" },
  { id: 4, title: "How To PROPER Squat For Growth", desc: "Master the fundamentals of the squat.", link: "https://www.youtube.com/embed/luHga_b_W-8" },
  { id: 5, title: "15 Min DUMBBELL WORKOUT", desc: "A full body workout with dumbbells.", link: "https://www.youtube.com/embed/ZRwwV1x3pGA" },
  { id: 6, title: "20 min Full Body STRETCH", desc: "Perfect for post-workout recovery.", link: "https://www.youtube.com/embed/ElogA5p6_vU" },
  { id: 7, title: "30-Minute HIIT Cardio Workout", desc: "No equipment needed for this cardio session.", link: "https://www.youtube.com/embed/ml6cT4AZdq8" },
  { id: 8, title: "The PERFECT Push Up", desc: "Master the push-up with correct form.", link: "https://www.youtube.com/embed/IODxDxX7oi4" },
];

const Tutorials = () => {
  return (
    <Container>
      <Wrapper>
        <Title>Fitness Tutorials</Title>
        <CardGrid>
          {dummyTutorials.map((tut) => (
            <Card key={tut.id}>
              <VideoFrame
                src={tut.link}
                title={tut.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <Title style={{ fontSize: "18px" }}>{tut.title}</Title>
              <Desc>{tut.desc}</Desc>
            </Card>
          ))}
        </CardGrid>
      </Wrapper>
    </Container>
  );
};

export default Tutorials;