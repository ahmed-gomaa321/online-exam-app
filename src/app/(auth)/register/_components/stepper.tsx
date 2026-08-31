import React from "react";
import { Rectangle } from "recharts";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export default function Stepper({ currentStep, totalSteps }: StepperProps) {
  return (
    <div
      className={`flex items-center justify-center w-11/12 mx-auto gap-1 ${currentStep === 1 ? "hidden" : ""}`}
    >
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isUpcoming = stepNumber > currentStep;

        return (
          <React.Fragment key={stepNumber}>
            {/* Step Box */}
            <div
              className={`
                flex items-center justify-center font-semibold relative w-3 h-3 rotate-45 transition-all duration-300 select-none shrink-0
                ${isCompleted ? "bg-blue-600 border-2 border-blue-600" : ""}
                ${isCurrent ? "w-6 h-6 bg-blue-100 border-2 after:absolute after:z-0  after:w-3 after:h-3 after:top-1/2 after:start-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-blue-600" : ""}
                ${isUpcoming ? "bg-blue-100 border-2 border-blue-600" : ""}
              `}
            >
              {isCompleted ? (
                <span className="w-3 h-w-3 block rotate-45 bg-black"></span>
              ) : (
                <div className="w-6 h-6 rotate-45">
                  <span className="w-3 h-3 rotate-45"></span>
                </div>
              )}
            </div>

            {/* Connecting Line */}
            {index < totalSteps - 1 && (
              <div
                className={`
                  flex-1 h-[1px] transition-colors duration-300
                  ${stepNumber < currentStep ? "border border-blue-600" : "border border-dashed border-blue-600"}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
