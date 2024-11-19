import { useEffect, useState } from "react";
import "./ongoing.scss";
import { useLocation, useParams } from "react-router-dom";

const ongoing = () => {
  const { id } = useParams(); // Access the dynamic parameter
  const location = useLocation();
  const passedId = location.state?.id;

  console.log(passedId)
  if (!passedId) {
    // Handle the case where state is undefined
    console.log("No state passed");
  }

  const user = location.state?.user;
  const [currentStep, setCurrentStep] = useState(1);
  const [processInfo, setProcessInfo] = useState({
    responder: "",
    status: "",
    otw: false,
    ota: false,
  });

  useEffect(() => {
    // Load saved step and process info from local storage based on ID
    const savedStep = localStorage.getItem(`currentStep_${id}`);
    const savedData = JSON.parse(localStorage.getItem(`processInfo_${id}`));
    if (savedStep) {
      setCurrentStep(Number(savedStep));
    }
    if (savedData) {
      setProcessInfo(savedData);
    }
  }, [id]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prevStep) => prevStep + 1);
      localStorage.setItem(`currentStep_${id}`, currentStep + 1); // Save current step with ID
      localStorage.setItem(`processInfo_${id}`, JSON.stringify(processInfo)); // Save form data with ID
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
      localStorage.setItem(`currentStep_${id}`, currentStep - 1); // Save current step with ID
      localStorage.setItem(`processInfo_${id}`, JSON.stringify(processInfo)); // Save form data with ID
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Report submitted:", processInfo);

    // Clear stored step and data for this specific ID
    localStorage.removeItem(`currentStep_${id}`);
    localStorage.removeItem(`processInfo_${id}`);

    alert("Done Transaction!");
  };

  return (
    <div className="Ongoing-container">
      <h1>Step: {currentStep}</h1>
      {passedId ? (
        <div>
          <p>Name: {passedId.name}</p>
          <p>Number: {passedId.phoneNumber}</p>
         
        </div>
      ) : (
        <p>No user information available.</p>
      )}

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="form-group">
            <label htmlFor="responder">HOi{user}</label>
          </div>
        )}
        {currentStep === 2 && (
          <div className="form-group">
            <label htmlFor="status">Status</label>
          </div>
        )}
        {currentStep === 3 && (
          <div className="form-group">
            <label htmlFor="otw">On-The-Way</label>
          </div>
        )}
        {currentStep === 4 && (
          <div className="form-group">
            <label htmlFor="ota">On-The-Air</label>
          </div>
        )}
        <div>
          {currentStep > 1 && (
            <button type="button" onClick={handlePrevious}>
              Previous
            </button>
          )}

          {currentStep < 5 ? (
            <button type="button" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button type="submit">Submit</button>
          )}
        </div>

        <p>Current Step: {currentStep}</p>
      </form>
   
    </div>
  );
};
export default ongoing;
