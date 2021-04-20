import fs from "fs";
const regInp = /^[A-Za-z]+=(MO|TU|WE|TH|FR|SA|SU)(([0-1][0-9]|2[0-3]):[0-5][0-9])-(([0-1][0-9]|2[0-3]):[0-5][0-9])(,(MO|TU|WE|TH|FR|SA|SU)(([0-1][0-9]|2[0-3]):[0-5][0-9])-(([0-1][0-9]|2[0-3]):[0-5][0-9]))*$/;
const daysOfWeek = ["MO", "TU", "WE", "TH", "FR"];
const daysOfWeekend = ["SA", "SU"];
const firstSlotTime = {
    startTime: "00:01",
    finishTime: "09:00",
    paidWeek: 25,
    paidWeekend: 30,
};
const secondSlotTime = {
    startTime: "09:01",
    finishTime: "18:00",
    paidWeek: 15,
    paidWeekend: 20,
};
const thirdSlotTime = {
    startTime: "18:01",
    finishTime: "24:00",
    paidWeek: 20,
    paidWeekend: 25,
};

const customError = (description) => {
    throw new Error(description);
};

const isValidInput = (input) => {
    return regInp.test(input);
};

const isInSlot = (slot, time) => {
    return time >= slot.startTime && time <= slot.finishTime;
};

const isDayOfWeek = (day) => daysOfWeek.includes(day);

const isDayOfWeekend = (day) => daysOfWeekend.includes(day);

export const getDataEmployee = (employee) => {
    let splitInfo = employee.split("=");
    return [splitInfo[0], splitInfo[1]];
};

export const getScheduleInfo = (scheduleWork) => {
    let daysInfo = scheduleWork.split(",").map((day) => {
        let dayName = day.slice(0, 2);
        let [startTime, finishTime] = day.slice(2, day.length).split("-");
        return {
            dayName: dayName,
            start: startTime,
            finish: finishTime,
        };
    });
    return daysInfo;
};

const stringToHours = (timeString) => {
    let splitTime = timeString.split(":");
    let time = new Date();
    time.setHours(parseInt(splitTime[0]), parseInt(splitTime[1]), 0);
    return time.getHours();
};

export const calculateHoursOfWork = (start, finish) => {
    return start < finish
        ? stringToHours(finish) - stringToHours(start)
        : customError("Error in calculateHoursOfWork check args");
};

const calculateOverlapWork = (day, slot, nextSlot) => {
    let total = 0;

    if (isDayOfWeek(day.dayName)) {
        total += nextSlot
            ? calculateHoursOfWork(day.start, slot.finishTime) * slot.paidWeek +
              calculateHoursOfWork(slot.finishTime, day.finish) *
                  nextSlot.paidWeek
            : calculateHoursOfWork(day.start, day.finish) * slot.paidWeek;
    } else if (isDayOfWeekend(day.dayName)) {
        total += nextSlot
            ? calculateHoursOfWork(day.start, slot.finishTime) *
                  slot.paidWeekend +
              calculateHoursOfWork(slot.finishTime, day.finish) *
                  nextSlot.paidWeekend
            : calculateHoursOfWork(day.start, day.finish) * slot.paidWeekend;
    } else {
        console.log("dia no existe");
    }

    return total;
};

const getPaidSlot = (day, slot, nextSlot) => {
    if (isInSlot(slot, day.start) && isInSlot(slot, day.finish)) {
        return calculateOverlapWork(day, slot, null);
    } else if (isInSlot(slot, day.start) && !isInSlot(slot, day.finish)) {
        return isInSlot(slot, day.start) && isInSlot(nextSlot, day.finish)
            ? calculateOverlapWork(day, slot, nextSlot)
            : console.log("no se pudo calcular el pago de horarios");
    } else {
        return 0;
    }
};

export const calculatePaidPerDay = (day) => {
    return (
        getPaidSlot(day, firstSlotTime, secondSlotTime) +
        getPaidSlot(day, secondSlotTime, thirdSlotTime) +
        getPaidSlot(day, thirdSlotTime, firstSlotTime)
    );
};
const calculatePaid = (total, totalday) => total + totalday;

export const calculateTotal = (days) => {
    let totalperDay = days
        .map((day) => {
            return calculatePaidPerDay(day);
        })
        .reduce(calculatePaid, 0);
    return totalperDay;
};

const showPaid = (employeeName, totalToPaid) => {
    let message = `The amount to pay ${employeeName} is: ${totalToPaid} USD`;
    console.log(message);
};

export const readInputFile = (file) => {
    fs.readFile(file, "utf8", (error, data) => {
        try {
            if (error) customError("File no exist");
            let employees = data.split("\n");

            for (let emp of employees) {
                if (isValidInput(emp)) {
                    let [employeeName, schedule] = getDataEmployee(emp);
                    let days = getScheduleInfo(schedule);
                    showPaid(employeeName, calculateTotal(days));
                }else {
                    customError('input no valid');
                }
            }
        } catch (error) {
            console.log(error);
        }
    });
};
