export type MonthlyStatData = [string,number];
export type TotalStatData = [number,number];

export type StatItem = {
    _id: {
        year: number
        month: number
        day: number
        categories: string[]
        accountId: string
    }
    sum: number
};
