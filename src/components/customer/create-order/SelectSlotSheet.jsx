import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  getBusinessTodayYmd,
  getLocalYmd,
  isPastBusinessSlot,
  toDateInputValue,
} from "@/utils/dateTime";
import { generateTimeOptions } from "@/utils/generateTimeOptions";

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
      fullDate: getLocalYmd(d),
    });
  }

  return days;
};

const SelectSlotSheet = ({ open, onOpenChange, onSelect, initialSlot }) => {
  const dates = generateDates();
  const allTimeSlots = useMemo(
    () =>
      generateTimeOptions({
        startHour: 8,
        endHour: 22,
        intervalMinutes: 30,
        includeEnd: true,
      }),
    [],
  );

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedTime, setSelectedTime] = useState(null);

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate?.fullDate) return allTimeSlots;

    if (selectedDate.fullDate !== getBusinessTodayYmd()) {
      return allTimeSlots;
    }

    return allTimeSlots.filter(
      (slot) => !isPastBusinessSlot(selectedDate.fullDate, slot),
    );
  }, [allTimeSlots, selectedDate]);

  useEffect(() => {
    if (open) {
      const dates = generateDates();

      if (initialSlot) {
        const initialDateKey =
          toDateInputValue(initialSlot.date) || getLocalYmd(initialSlot.date);
        const matchedDate = dates.find(
          (d) => d.fullDate === initialDateKey,
        );

        setSelectedDate(matchedDate || dates[0]);
        setSelectedTime(initialSlot.time || null);
      } else {
        setSelectedDate(dates[0]);
        setSelectedTime(null);
      }
    }
  }, [open, initialSlot]);

  useEffect(() => {
    if (selectedTime && !availableTimeSlots.includes(selectedTime)) {
      setSelectedTime(null);
    }
  }, [availableTimeSlots, selectedTime]);

  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let hasMoved = false;

    const onMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      hasMoved = false;
    };

    const onMouseLeave = () => {
      isDown = false;
    };

    const onMouseUp = () => {
      isDown = false;
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 5) {
        hasMoved = true;
      }
      el.scrollLeft = scrollLeft - walk;
    };

    const onClickCapture = (e) => {
      if (hasMoved) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    const onWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollTo({
        left: el.scrollLeft + e.deltaY * 1.5,
        behavior: "auto",
      });
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-4 flex flex-col h-full gap-4">
        <SheetHeader className="shrink-0">
          <SheetTitle>Select date and time</SheetTitle>
          <SheetDescription>
            Choose the service date and slot for this cart item.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable middle content area */}
        <div className="flex-1 overflow-y-auto pr-1 thin-scrollbar flex flex-col gap-6">
          {/* Dates */}
          <div
            ref={scrollRef}
            className="flex shrink-0 gap-3 overflow-x-auto overflow-y-visible px-1 py-2 thin-scrollbar select-none cursor-grab active:cursor-grabbing"
          >
            {dates.map((d, i) => {
              const active = selectedDate.fullDate === d.fullDate;

              return (
                <div
                  key={i}
                  onClick={() => setSelectedDate(d)}
                  className={`flex min-h-[68px] min-w-[86px] shrink-0 flex-col items-center justify-center rounded-lg border px-3 py-2 text-center cursor-pointer
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
          <div>
            <h3 className="text-sm font-medium mb-3">Select a time slot</h3>

            {availableTimeSlots.length === 0 ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
                No slots are available for the selected date. Choose another day between 8:00 AM and 10:00 PM.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {availableTimeSlots.map((slot) => {
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
            )}
          </div>
        </div>

        <Button
          className="w-full shrink-0"
          variant="abhicares"
          disabled={!selectedTime}
          onClick={() => {
            onSelect({
              date: selectedDate.fullDate,
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
