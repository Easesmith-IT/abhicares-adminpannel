import React from "react";

const steps = [
  { id: 1, label: "Categories" },
  { id: 2, label: "Services" },
  { id: 3, label: "Products & Packages" },
  { id: 4, label: "Checkout" },
];

export default function Stepper({ currentStep, onStepClick }) {
  return (
    <div className="w-full flex items-center justify-between">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div key={step.id} className="flex-1 flex items-center">
            {/* Step Circle */}
            <div
              onClick={() => onStepClick?.(step.id)}
              className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer
                ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
            >
              {isCompleted ? "✓" : step.id}
            </div>

            {/* Label */}
            <div className="ml-2 text-sm font-medium">{step.label}</div>

            {/* Line */}
            {index !== steps.length - 1 && (
              <div className="flex-1 h-1 mx-4 bg-gray-300">
                <div
                  className={`h-1 ${
                    currentStep > step.id ? "bg-green-500" : "bg-gray-300"
                  }`}
                  style={{
                    width: currentStep > step.id ? "100%" : "0%",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
