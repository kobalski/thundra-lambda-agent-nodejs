import {
    getCpuUsage,
    getCpuLoad,
    readProcStatPromise,
    readProcIoPromise,
} from "../../src/plugins/utils";

jest.mock("os", () => ({
    cpus: () => {
        return ([
            {
                model: "Intel(R) Xeon(R) CPU E5-2680 v2 @ 2.80GHz",
                speed: 2800,
                times: {user: 60000, nice: 0, sys: 30000, idle: 9000000, irq: 0}
            },
            {
                model: "Intel(R) Xeon(R) CPU E5-2680 v2 @ 2.80GHz",
                speed: 2800,
                times: {user: 50000, nice: 0, sys: 20000, idle: 9000000, irq: 0}
            }
        ]);
    }
}));

jest.mock("../../src/constants", () => ({
    PROC_STAT_PATH: "./test/mocks/mock-proc-stat",
    PROC_IO_PATH: "./test/mocks/mock-proc-io",
}));

describe("getCpuUsage", () => {
    const result = getCpuUsage();
    it("Should calculate system cpu usage", () => {
        expect(result.sysCpuUsed).toEqual(160000);
        expect(result.sysCpuTotal).toEqual(18160000);
    });
});

describe("getCpuLoad", () => {
    const start = {
        procCpuUsed: 30000,
        sysCpuUsed: 160000,
        sysCpuTotal: 12000000
    };
    const end = {
        procCpuUsed: 50000,
        sysCpuUsed: 320000,
        sysCpuTotal: 30000000
    };
    const startNaN = {
        procCpuUsed: NaN,
        sysCpuUsed: NaN,
        sysCpuTotal: NaN
    };
    const result = getCpuLoad(start, end, 100);
    const resultNaN = getCpuLoad(startNaN, end, 100);
    it("Should calculate process cpu load", () => {
        expect(result.procCpuLoad).toBeCloseTo(0.00001);
        expect(resultNaN.procCpuLoad).toBe(0);

    });
    it("Should calculate system cpu load", () => {
        expect(result.sysCpuLoad).toBeCloseTo(0.009);
        expect(resultNaN.procCpuLoad).toBe(0);
    });
});


describe("readProcStatPromise", () => {
    it("Should read proc stat file correctly", async () => {
        const procStatData = await readProcStatPromise();
        expect(procStatData).toEqual({threadCount: 20});
    });
});

describe("readProcIoPromise", () => {
    it("Should read proc io file correctly", async () => {
        const procIoData = await readProcIoPromise();
        expect(procIoData).toEqual({readBytes: 5453, writeBytes: 323932160});
    });
});