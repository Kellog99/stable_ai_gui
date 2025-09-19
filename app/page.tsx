"use client";
import './pages/HomePage/HomePage.css';
import HomePageDrop from "./pages/HomePage/HomePageDrop";
import HomePageTask from "./pages/HomePage/HomePageTask";



const HomePage: React.FC = ({
 }) => {

  return (
    <div className="home-container">
      <HomePageDrop />
      <div className='task'>
        <div className="section-header">
          <h2 className="section-title">
            Analysis Tasks
          </h2>
          <p className="section-subtitle">
            Select an analysis task to begin
          </p>
        </div>

        <HomePageTask />
      </div>
    </div>
  );
}

export default HomePage