import Reporter from "../src/reporter";

test("httpsRequest unauthorized apiKey", async () => {
    const reporter = new Reporter("apiKey");
    const mockReport1 = {data: "data1"};
    const mockReport2 = {data: "data2"};
    reporter.addReport(mockReport1);
    reporter.addReport(mockReport2);
    jest.useFakeTimers();
    let res = await reporter.httpsRequest();
    jest.runAllTimers();
    expect(res.status).toBe(401);
});