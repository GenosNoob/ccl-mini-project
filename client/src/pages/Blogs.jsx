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
  flex-direction: column;
  gap: 20px;
  margin-bottom: 100px;
`;
const BlogCard = styled.div`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_secondary + '20'}; /* Adjusted border and shadow for light theme */
  border-radius: 14px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const AuthorDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
`; /* Darker text for light theme */
const Content = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.5;
`; /* Darker text for light theme */

const dummyBlogs = [
  { id: 1, title: "The Future of Wearable Tech in Fitness", author: "Dr. Eva Rostova", date: "Mar 28, 2026", summary: "From smart rings to metabolic trackers, we explore the next generation of devices that will shape how we monitor our health and performance." },
  { id: 2, title: "AI Personal Trainers: Are They Worth It?", author: "Markus Chen", date: "Mar 15, 2026", summary: "An in-depth review of the leading AI-powered fitness apps and whether they can truly replace a human coach for your workout needs." },
  { id: 3, title: "Beyond the Gym: The Best Outdoor Fitness Activities for Spring 2026", author: "Sam Peterson", date: "Mar 02, 2026", summary: "Tired of the treadmill? Here are our top picks for outdoor activities, from trail running to urban parkour, to get you moving this season." },
  { id: 4, title: "Nutrigenomics: Eating for Your Genes", author: "Chloe Bennett", date: "Feb 20, 2026", summary: "A fascinating look into the emerging science of nutrigenomics, which promises personalized nutrition plans based on your unique DNA." },
  { id: 5, title: "Mindful Movement: The Rise of Somatic Workouts", author: "Leo Gonzalez", date: "Feb 05, 2026", summary: "It's not just about burning calories. Discover how somatic exercises focus on the internal experience of movement to improve your mind-body connection." },
  { id: 6, title: "Bio-Hacking Your Sleep for Peak Performance", author: "Aisha Khan", date: "Jan 22, 2026", summary: "Sleep is your ultimate recovery tool. We cover the latest tips, tech, and supplements to help you optimize your sleep for better gains." },
];

const Blogs = () => {
  return (
    <Container>
      <Wrapper>
        <Title>Fitness & Health Blog</Title>
        <CardGrid>
          {dummyBlogs.map((blog) => (
            <BlogCard key={blog.id}>
              <Title style={{ fontSize: "20px", color: "inherit" }}>{blog.title}</Title>
              <AuthorDate>
                By {blog.author} | {blog.date}
              </AuthorDate>
              <Content>{blog.summary}</Content>
              <Title style={{ fontSize: "14px", cursor: "pointer" }}>Read More...</Title>
            </BlogCard>
          ))}
        </CardGrid>
      </Wrapper>
    </Container>
  );
};

export default Blogs;