import {
    getDataEmployee,
    getScheduleInfo,
    calculateHoursOfWork,
    calculatePaidPerDay,
    calculateTotal,
} from "../src/utils.js";

test("extract name and schedule of an employee", () => {
    expect(
        getDataEmployee(
            "RENE=MO10:00-12:00,TU10:00-12:00,TH01:00-03:00,SA14:00-18:00,SU20:00-21:00"
        )
    ).toStrictEqual([
        "RENE",
        "MO10:00-12:00,TU10:00-12:00,TH01:00-03:00,SA14:00-18:00,SU20:00-21:00",
    ]);
    expect(getDataEmployee("JAIRO=MO10:00-20:00")).toStrictEqual([
        "JAIRO",
        "MO10:00-20:00",
    ]);
});

test("Estructure data from days", () => {
    expect(
        getScheduleInfo(
            "MO10:00-12:00,TU10:00-12:00,TH01:00-03:00,SA14:00-18:00,SU20:00-21:00"
        )
    ).toStrictEqual([
        { dayName: "MO", start: "10:00", finish: "12:00" },
        { dayName: "TU", start: "10:00", finish: "12:00" },
        { dayName: "TH", start: "01:00", finish: "03:00" },
        { dayName: "SA", start: "14:00", finish: "18:00" },
        { dayName: "SU", start: "20:00", finish: "21:00" },
    ]);

    expect(getScheduleInfo("MO10:00-20:00")).toStrictEqual([
        { dayName: "MO", start: "10:00", finish: "20:00" },
    ]);
});

test("Calculate how long work an employee in a day", () => {
    expect(calculateHoursOfWork("10:00", "12:00")).toBe(2);
    expect(calculateHoursOfWork("10:00", "20:00")).toBe(10);
    expect(() => calculateHoursOfWork("10:00", "09:00")).toThrow(
        "Error in calculateHoursOfWork check args"
    );
});

test("Calculate paid of a day", () => {
    expect(
        calculatePaidPerDay({ dayName: "MO", start: "10:00", finish: "12:00" })
    ).toBe(30);
    expect(
        calculatePaidPerDay({ dayName: "MO", start: "10:00", finish: "20:00" })
    ).toBe(160);
});

test("Calculate total paid of a employee", () => {
    expect(
        calculateTotal([
            { dayName: "MO", start: "10:00", finish: "12:00" },
            { dayName: "TU", start: "10:00", finish: "12:00" },
            { dayName: "TH", start: "01:00", finish: "03:00" },
            { dayName: "SA", start: "14:00", finish: "18:00" },
            { dayName: "SU", start: "20:00", finish: "21:00" },
        ])
    ).toBe(215);
    expect(
        calculateTotal([
            { dayName: "MO", start: "10:00", finish: "12:00" },
            { dayName: "TH", start: "12:00", finish: "14:00" },
            { dayName: "SU", start: "20:00", finish: "21:00" },
        ])
    ).toBe(85);
});
