"use strict";
var LigthState;
(function (LigthState) {
    LigthState[LigthState["Off"] = 0] = "Off";
    LigthState[LigthState["On"] = 1] = "On";
})(LigthState || (LigthState = {}));
class BerlinClock {
    display(date) {
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const miliSeconds = date.getUTCMilliseconds();
        const totalFiveHourLightsOn = Math.floor(hours / 5);
        const totalHourLightsOn = Math.floor(hours % 5);
        const totalFiveMinutesLightsOn = Math.floor(minutes / 5);
        const totalMinutesLightsOn = Math.floor(minutes % 5);
        return {
            fiveHourLights: this.initLightsRow(4).fill(LigthState.On, 0, totalFiveHourLightsOn),
            hourLights: this.initLightsRow(4).fill(LigthState.On, 0, totalHourLightsOn),
            fiveMinutesLights: this.initLightsRow(11).fill(LigthState.On, 0, totalFiveMinutesLightsOn),
            minutesLights: this.initLightsRow(4).fill(LigthState.On, 0, totalMinutesLightsOn),
            secondBeepLight: miliSeconds > 500 ? LigthState.Off : LigthState.On,
        };
    }
    initLightsRow(totalRowLength) {
        const lightsRow = new Array(totalRowLength);
        return lightsRow.fill(LigthState.Off, 0, totalRowLength);
    }
}
describe("Berlin Clock", () => {
    describe("handles 5 hour lights row", () => {
        it.each([
            {
                date: new Date(`2025-01-01T00:00:00Z`),
                expectedResponse: buildBerlinClockResponse(0, 0),
            },
            {
                date: new Date(`2025-01-01T01:00:00Z`),
                expectedResponse: buildBerlinClockResponse(0, 1),
            },
            {
                date: new Date(`2025-01-01T02:00:00Z`),
                expectedResponse: buildBerlinClockResponse(0, 2),
            },
            {
                date: new Date(`2025-01-01T03:00:00Z`),
                expectedResponse: buildBerlinClockResponse(0, 3),
            },
            {
                date: new Date(`2025-01-01T04:00:00Z`),
                expectedResponse: buildBerlinClockResponse(0, 4),
            },
            {
                date: new Date(`2025-01-01T05:00:00Z`),
                expectedResponse: buildBerlinClockResponse(1, 0),
            },
            {
                date: new Date(`2025-01-01T06:00:00Z`),
                expectedResponse: buildBerlinClockResponse(1, 1),
            },
            {
                date: new Date(`2025-01-01T07:00:00Z`),
                expectedResponse: buildBerlinClockResponse(1, 2),
            },
            {
                date: new Date(`2025-01-01T08:00:00Z`),
                expectedResponse: buildBerlinClockResponse(1, 3),
            },
            {
                date: new Date(`2025-01-01T09:00:00Z`),
                expectedResponse: buildBerlinClockResponse(1, 4),
            },
            {
                date: new Date(`2025-01-01T10:00:00Z`),
                expectedResponse: buildBerlinClockResponse(2, 0),
            },
            {
                date: new Date(`2025-01-01T11:00:00Z`),
                expectedResponse: buildBerlinClockResponse(2, 1),
            },
            {
                date: new Date(`2025-01-01T12:00:00Z`),
                expectedResponse: buildBerlinClockResponse(2, 2),
            },
            {
                date: new Date(`2025-01-01T13:00:00Z`),
                expectedResponse: buildBerlinClockResponse(2, 3),
            },
            {
                date: new Date(`2025-01-01T14:00:00Z`),
                expectedResponse: buildBerlinClockResponse(2, 4),
            },
            {
                date: new Date(`2025-01-01T15:00:00Z`),
                expectedResponse: buildBerlinClockResponse(3, 0),
            },
            {
                date: new Date(`2025-01-01T16:00:00Z`),
                expectedResponse: buildBerlinClockResponse(3, 1),
            },
            {
                date: new Date(`2025-01-01T17:00:00Z`),
                expectedResponse: buildBerlinClockResponse(3, 2),
            },
            {
                date: new Date(`2025-01-01T18:00:00Z`),
                expectedResponse: buildBerlinClockResponse(3, 3),
            },
            {
                date: new Date(`2025-01-01T19:00:00Z`),
                expectedResponse: buildBerlinClockResponse(3, 4),
            },
            {
                date: new Date(`2025-01-01T20:00:00Z`),
                expectedResponse: buildBerlinClockResponse(4, 0),
            },
            {
                date: new Date(`2025-01-01T21:00:00Z`),
                expectedResponse: buildBerlinClockResponse(4, 1),
            },
            {
                date: new Date(`2025-01-01T22:00:00Z`),
                expectedResponse: buildBerlinClockResponse(4, 2),
            },
            {
                date: new Date(`2025-01-01T23:00:00Z`),
                expectedResponse: buildBerlinClockResponse(4, 3),
            },
        ])("returns five hour first light all off for $date date", ({ date, expectedResponse }) => {
            const berlinClock = new BerlinClock();
            const time = berlinClock.display(date);
            expect(time).toEqual(expectedResponse);
        });
    });
    describe("handles hour lights row", () => {
        it.each([
            {
                date: new Date(`2025-01-01T01:00:00Z`),
                expectedResponse: buildBerlinClockResponse(0, 1),
            },
            {
                date: new Date(`2025-01-01T04:00:00Z`),
                expectedResponse: buildBerlinClockResponse(0, 4),
            },
            {
                date: new Date(`2025-01-01T06:00:00Z`),
                expectedResponse: buildBerlinClockResponse(1, 1),
            },
            {
                date: new Date(`2025-01-01T11:00:00Z`),
                expectedResponse: buildBerlinClockResponse(2, 1),
            },
            {
                date: new Date(`2025-01-01T16:00:00Z`),
                expectedResponse: buildBerlinClockResponse(3, 1),
            },
            {
                date: new Date(`2025-01-01T21:00:00Z`),
                expectedResponse: buildBerlinClockResponse(4, 1),
            },
            {
                date: new Date(`2025-01-01T23:00:00Z`),
                expectedResponse: buildBerlinClockResponse(4, 3),
            },
        ])("returns five hour first light all off for $date date", ({ date, expectedResponse }) => {
            const berlinClock = new BerlinClock();
            const time = berlinClock.display(date);
            expect(time).toEqual(expectedResponse);
        });
    });
    describe("handles 5 minutes lights row", () => {
        it.each([
            {
                date: new Date(`2025-01-01T00:05:00Z`),
                expectedResponse: buildBerlinClockResponse(0, 0, 1),
            },
            {
                date: new Date(`2025-01-01T23:55:00Z`),
                expectedResponse: buildBerlinClockResponse(4, 3, 11),
            },
        ])("returns five minute first light all off for $date date", ({ date, expectedResponse }) => {
            const berlinClock = new BerlinClock();
            const time = berlinClock.display(date);
            expect(time).toEqual(expectedResponse);
        });
    });
    describe("handles minutes lights row", () => {
        it.each([
            {
                date: new Date(`2025-01-01T00:06:00Z`),
                expectedResponse: buildBerlinClockResponse(0, 0, 1, 1),
            },
            {
                date: new Date(`2025-01-01T23:59:00Z`),
                expectedResponse: buildBerlinClockResponse(4, 3, 11, 4),
            },
            {
                date: new Date(`2025-01-01T19:56:00Z`),
                expectedResponse: buildBerlinClockResponse(3, 4, 11, 1),
            },
        ])("returns minute lights for $date date", ({ date, expectedResponse }) => {
            const berlinClock = new BerlinClock();
            const time = berlinClock.display(date);
            expect(time).toEqual(expectedResponse);
        });
    });
    describe("handles second bleeping light", () => {
        it.each([
            {
                date: new Date(`2025-01-01T00:00:00.000Z`),
                expectedResponse: buildBerlinClockResponse(0, 0, 0, 0, LigthState.On),
            },
            {
                date: new Date(`2025-01-01T00:00:00.600Z`),
                expectedResponse: buildBerlinClockResponse(0, 0, 0, 0, LigthState.Off),
            },
        ])("returns second bleeeping light on or off depending", ({ date, expectedResponse }) => {
            const berlinClock = new BerlinClock();
            const time = berlinClock.display(date);
            expect(time).toEqual(expectedResponse);
        });
    });
});
function buildBerlinClockResponse(totalFiveHourLights = 0, totalHourLights = 0, totalFiveMinutesLights = 0, totalMinutesLights = 0, secondBeepLight = LigthState.On) {
    const initLightsRow = (totalRowLength) => {
        const lightsRow = new Array(totalRowLength);
        return lightsRow.fill(LigthState.Off, 0, totalRowLength);
    };
    return {
        fiveHourLights: initLightsRow(4).fill(LigthState.On, 0, totalFiveHourLights),
        hourLights: initLightsRow(4).fill(LigthState.On, 0, totalHourLights),
        fiveMinutesLights: initLightsRow(11).fill(LigthState.On, 0, totalFiveMinutesLights),
        minutesLights: initLightsRow(4).fill(LigthState.On, 0, totalMinutesLights),
        secondBeepLight: secondBeepLight,
    };
}
