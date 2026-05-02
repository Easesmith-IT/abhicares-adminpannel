import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const generateDates = () => {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 15; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);

    days.push({
      date: d,
      label: d.toLocaleDateString("en-IN", { weekday: "short" }),
      day: d.getDate(),
      fullDate: d.toISOString().split("T")[0], // useful later
    });
  }

  return days;
};

const generateTimeSlots = () => {
  const slots = [];

  const startHour = 15; // 3 PM (24hr format)
  const endHour = 21; // 9 PM

  for (let hour = startHour; hour < endHour; hour++) {
    for (let min of [0, 30]) {
      const date = new Date();
      date.setHours(hour, min, 0, 0);

      let hrs = hour;
      const suffix = hrs >= 12 ? "PM" : "AM";

      if (hrs > 12) hrs -= 12;
      if (hrs === 0) hrs = 12;

      const formatted = `${hrs.toString().padStart(2, "0")}:${min
        .toString()
        .padStart(2, "0")} ${suffix}`;

      slots.push(formatted);
    }
  }

  return slots;
};

const timeSlots = generateTimeSlots();

const SelectSlotSheet = ({ open, onOpenChange, onSelect, initialSlot }) => {
  const dates = generateDates();

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    if (open) {
      const dates = generateDates();

      if (initialSlot) {
        const matchedDate = dates.find(
          (d) =>
            new Date(d.date).toDateString() ===
            new Date(initialSlot.date).toDateString(),
        );

        setSelectedDate(matchedDate || dates[0]);
        setSelectedTime(initialSlot.time);
      } else {
        setSelectedDate(dates[0]);
        setSelectedTime(null);
      }
    }
  }, [open, initialSlot]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-4">
        <SheetHeader>
          <SheetTitle>Select date and time</SheetTitle>
        </SheetHeader>

        {/* Dates */}
        <div className="flex gap-3 mt-4 overflow-x-auto p-4">
          {dates.map((d, i) => {
            const active = selectedDate.day === d.day;

            return (
              <div
                key={i}
                onClick={() => setSelectedDate(d)}
                className={`min-w-[70px] text-center p-3 rounded-lg border cursor-pointer
                  ${active ? "border-primary bg-primary/5" : ""}
                `}
              >
                <p className="text-xs">{d.label}</p>
                <p className="font-semibold">{d.day}</p>
              </div>
            );
          })}
        </div>

        {/* Time */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Select a time slot</h3>

          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((slot) => {
              const active = selectedTime === slot;

              return (
                <div
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`border rounded-lg py-2 text-center cursor-pointer text-sm
                    ${active ? "border-primary bg-primary/5" : ""}
                  `}
                >
                  {slot}
                </div>
              );
            })}
          </div>
        </div>

        <Button
          className="mt-6 w-full"
          variant="abhicares"
          disabled={!selectedTime}
          onClick={() => {
            onSelect({
              date: selectedDate.date,
              time: selectedTime,
            });
            onOpenChange(false);
          }}
        >
          Confirm Slot
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default SelectSlotSheet;
