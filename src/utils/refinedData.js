// CO2 levels by year - Annual averages (full dataset)
export const CO2_DATA = [
    { year: 1958, co2: 315.71 },
    { year: 1959, co2: 316.65 },
    { year: 1960, co2: 317.58 },
    { year: 1961, co2: 318.54 },
    { year: 1962, co2: 319.68 },
    { year: 1963, co2: 319.86 },
    { year: 1964, co2: 320.75 },
    { year: 1965, co2: 320.89 },
    { year: 1966, co2: 322.39 },
    { year: 1967, co2: 323.03 },
    { year: 1968, co2: 323.89 },
    { year: 1969, co2: 325.63 },
    { year: 1970, co2: 326.93 },
    { year: 1971, co2: 327.18 },
    { year: 1972, co2: 327.75 },
    { year: 1973, co2: 330.30 },
    { year: 1974, co2: 331.49 },
    { year: 1975, co2: 331.94 },
    { year: 1976, co2: 333.36 },
    { year: 1977, co2: 334.96 },
    { year: 1978, co2: 336.66 },
    { year: 1979, co2: 338.27 },
    { year: 1980, co2: 340.07 },
    { year: 1981, co2: 341.63 },
    { year: 1982, co2: 342.78 },
    { year: 1983, co2: 343.37 },
    { year: 1984, co2: 345.68 },
    { year: 1985, co2: 347.91 },
    { year: 1986, co2: 348.25 },
    { year: 1987, co2: 349.81 },
    { year: 1988, co2: 352.50 },
    { year: 1989, co2: 354.08 },
    { year: 1990, co2: 355.75 },
    { year: 1991, co2: 357.33 },
    { year: 1992, co2: 357.97 },
    { year: 1993, co2: 358.59 },
    { year: 1994, co2: 360.11 },
    { year: 1995, co2: 361.98 },
    { year: 1996, co2: 364.28 },
    { year: 1997, co2: 364.65 },
    { year: 1998, co2: 367.36 },
    { year: 1999, co2: 369.84 },
    { year: 2000, co2: 370.75 },
    { year: 2001, co2: 372.63 },
    { year: 2002, co2: 374.30 },
    { year: 2003, co2: 376.64 },
    { year: 2004, co2: 379.06 },
    { year: 2005, co2: 380.95 },
    { year: 2006, co2: 382.86 },
    { year: 2007, co2: 384.81 },
    { year: 2008, co2: 386.28 },
    { year: 2009, co2: 389.04 },
    { year: 2010, co2: 391.37 },
    { year: 2011, co2: 392.80 },
    { year: 2012, co2: 394.59 },
    { year: 2013, co2: 397.66 },
    { year: 2014, co2: 399.91 },
    { year: 2015, co2: 401.74 },
    { year: 2016, co2: 405.06 },
    { year: 2017, co2: 407.53 },
    { year: 2018, co2: 409.59 },
    { year: 2019, co2: 412.18 },
    { year: 2020, co2: 414.72 },
    { year: 2021, co2: 417.61 },
    { year: 2022, co2: 418.76 },
    { year: 2023, co2: 420.99 },
    { year: 2024, co2: 425.38 }
];

// Updated statistics with more detailed analysis
export const CO2_STATISTICS = {
    timePeriod: {
        start: 1958,
        end: 2024,
        totalYears: 66,
        decadeRates: {
            '1960s': 1.05,  // ppm/year
            '1970s': 1.34,
            '1980s': 1.62,
            '1990s': 1.48,
            '2000s': 1.95,
            '2010s': 2.34,
            '2020s': 2.40   // current
        }
    },
    levels: {
        min: 315.71,
        max: 425.38,
        totalIncrease: 109.67,
        averageAnnualIncrease: 1.66
    },
    acceleration: {
        pre1980: 1.16,    // ppm/year
        post1980: 1.89,   // ppm/year
        post2000: 2.15,   // ppm/year
        post2020: 2.40    // ppm/year
    },
    milestones: {
        crossing320: 1964,
        crossing330: 1973,
        crossing340: 1980,
        crossing350: 1988,
        crossing360: 1994,
        crossing370: 2000,
        crossing380: 2005,
        crossing390: 2010,
        crossing400: 2015,
        crossing410: 2019,
        crossing420: 2022
    }
};

// Helper function for interpolation
export function interpolateCO2(year) {
    if (year <= CO2_DATA[0].year) return CO2_DATA[0].co2;
    if (year >= CO2_DATA[CO2_DATA.length - 1].year) return CO2_DATA[CO2_DATA.length - 1].co2;

    const lowerIndex = CO2_DATA.findIndex(d => d.year > year) - 1;
    const lower = CO2_DATA[lowerIndex];
    const upper = CO2_DATA[lowerIndex + 1];
    
    const ratio = (year - lower.year) / (upper.year - lower.year);
    return lower.co2 + (upper.co2 - lower.co2) * ratio;
}
