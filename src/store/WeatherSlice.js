import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchWeatherData = createAsyncThunk(
    'weather/fetchWeatherData',
    async (cityName, { rejectWithValue }) => {
        try {
            const geoRes = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    cityName
                )}&limit=1`
            );
            const geoData = await geoRes.json();

            if (geoData.length === 0) {
                throw new Error('Город не найден');
            }

            const { lat, lon } = geoData[0];

            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=precipitation,weathercode`
            );
            const weatherData = await weatherRes.json();

            const current = weatherData.current_weather;
            const timeIndex = weatherData.hourly.time.findIndex(
                (t) => t === current.time
            );
            const precipitation =
                timeIndex !== -1
                    ? weatherData.hourly.precipitation[timeIndex]
                    : null;

            const weathercode = current.weathercode;

            const condition =
                weathercode === 0
                    ? 'Clear'
                    : weathercode >= 1 && weathercode <= 3
                        ? 'Cloudy'
                        : weathercode >= 51 && weathercode <= 67
                            ? 'Rainy'
                            : weathercode >= 71 && weathercode <= 77
                                ? 'Snowy'
                                : weathercode >= 95
                                    ? 'Thunderstorm'
                                    : 'Other';

            const bgMap = {
                Clear: { left: 'sunny-left', body: 'sunny-body' },
                Cloudy: { left: 'cloudy-left', body: 'cloudy-body' },
                Rainy: { left: 'rainy-left', body: 'rainy-body' },
                Snowy: { left: 'snowy-left', body: 'snowy-body' },
                Thunderstorm: { left: 'storm-left', body: 'storm-body' },
                Other: { left: 'default-left', body: 'default-body' },
            };

            const bgClasses = bgMap[condition];

            return {
                ...current,
                city: cityName,
                precipitation,
                condition,
                bgClass: bgClasses.left,
                bodyBgClass: bgClasses.body,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const weatherSlice = createSlice({
    name: 'weather',
    initialState: {
        currentCity: 'Tashkent',
        weather: null,
        isLoading: false,
        error: null,
        bgClass: '',
        bodyBgClass: '',
        popularCities: ['New York', 'Moscow', 'Tashkent', 'Astana'],
    },
    reducers: {
        setCurrentCity: (state, action) => {
            state.currentCity = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWeatherData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchWeatherData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.weather = action.payload;
                state.bgClass = action.payload.bgClass;
                state.bodyBgClass = action.payload.bodyBgClass;
            })
            .addCase(fetchWeatherData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { setCurrentCity, clearError } = weatherSlice.actions;
export default weatherSlice.reducer;