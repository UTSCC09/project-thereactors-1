import './CookingPage.scss';
import React, { useState } from "react";
// import IngredientSection from "./IngredientSection.js";
// import ToolSection from "./ToolSection.js";
// import CookingStepsSection from "./CookingStepsSection.js";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

  

export default function CookingPage() {
    const steps = [
        {
          label: 'Check your tools',
          description: `For each ad campaign that you create, you can control how much
                    you're willing to spend on clicks and conversions, which networks
                    and geographical locations you want your ads to show on, and more.`,
        },
        {
          label: 'Create an ad group',
          description:
            'An ad group contains one or more ads which target a shared set of keywords.',
        },
        {
          label: 'Create an ad',
          description: `Try out different ad text to see what brings in the most customers,
                    and learn how to enhance your ads using features like ad extensions.
                    If you run into any problems with your ads, find out how to tell if
                    they're running and how to resolve approval issues.`,
        },
      ];
    
    // const {author, recipeName, tools,ingredients,steps} = props;
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
  
    const handleReset = () => {
      setActiveStep(0);
    };
  

    return (
        // <div className="cooking-recipe-page">
        // <div className="recipe-meta">
        //     <div className="recipe-author-box">
        //     <img className="recipe-author-pic"></img>
        //     <div className="recipe-author-name">Victor</div>
        // </div>
            
        // </div>
        // <div className="progress-nav-bar"></div>
        // <div className="cooking-recipe-page-content">
        //     <div className="page-header">How to cook </div>
        //     <IngredientSection/>
        //     <ToolSection/>
        //     <CookingStepsSection/>
        // </div>
        // </div>
        <Box sx={{ maxWidth: 1000 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === 2 ? (
                    <Typography variant="caption">Last step</Typography>
                  ) : null
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                <Typography>{step.description}
                
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>

                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>Bon appetit</Typography>
            <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
              Back
            </Button>
          </Paper>
        )}
      </Box>
  
    )
}