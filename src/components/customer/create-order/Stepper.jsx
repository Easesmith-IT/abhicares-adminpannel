import React from "react";

export const steps = [
  { id: 1, label: "User Addresses" },
  { id: 2, label: "Categories" },
  { id: 3, label: "Services" },
  { id: 4, label: "Products & Packages" },
  { id: 5, label: "Checkout" },
];

export default function Stepper({
  currentStep,
  onStepClick,
  isStepEnabled = () => true,
}) {
  return (
    <div className="flex w-full items-center justify-between">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        const isEnabled = isStepEnabled(step.id);

        return (
          <div key={step.id} className="flex flex-1 items-center">
            <button
              type="button"
              onClick={() => isEnabled && onStepClick?.(step.id)}
              disabled={!isEnabled}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                isCompleted
                  ? "bg-green-500 text-white"
                  : isActive
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
              } ${isEnabled ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
            >
              {step.id}
            </button>

            <div
              className={`ml-2 text-sm font-medium ${
                isEnabled ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {step.label}
            </div>

            {index !== steps.length - 1 && (
              <div className="mx-4 h-1 flex-1 bg-gray-300">
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
