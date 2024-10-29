# Weather App

## Project Description

The Weather App is a web application that provides real-time weather information and forecasts for any city in the world. The app uses the OpenWeatherMap API to fetch weather data and displays it in a user-friendly interface. The app also includes a 5-day weather forecast and an AI-powered chatbot to answer weather-related queries.

### Features

- Real-time weather updates for any city
- 5-day weather forecast
- AI-powered chatbot for weather-related queries
- Responsive design for mobile and desktop
- Geolocation support to fetch weather data for the user's current location

## Installation and Setup

### Prerequisites

- Node.js and npm installed on your machine

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/i228808/Weather-App.git
   cd Weather-App
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory of your project and add the following lines, replacing the placeholder values with your actual API keys:
   ```env
   OPENAPI=your_openweathermap_api_key
   GOOGLEAPI=your_google_api_key
   ```

4. Run the application:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000` to view the app.

## API Keys

The application requires two API keys:

1. **OpenWeatherMap API Key**: Used to fetch weather data. You can obtain it by signing up at [OpenWeatherMap](https://home.openweathermap.org/users/sign_up).

2. **Google API Key**: Used for the AI-powered chatbot. You can obtain it by signing up at [Google Cloud](https://cloud.google.com/).

## Project Structure

- `index.html`: The main HTML file for the dashboard.
- `forecast.html`: The HTML file for the 5-day weather forecast.
- `dashboard.css`: The CSS file for styling the dashboard.
- `forecast.css`: The CSS file for styling the forecast page.
- `dashboard.js`: The JavaScript file for handling the dashboard logic.
- `forecast.js`: The JavaScript file for handling the forecast logic.
- `.env`: The file containing environment variables for API keys.

## Contribution Guidelines

We welcome contributions to the Weather App! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

### Code of Conduct

We expect all contributors to adhere to the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/).

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure that your API keys are correctly set in the `.env` file.
2. **Network Errors**: Check your internet connection and ensure that the API services are not down.

### FAQ

**Q: How do I change the default city?**
A: You can change the default city by modifying the `DEFAULT_CITY` variable in `dashboard.js` and `forecast.js`.

**Q: Can I use this app on my mobile device?**
A: Yes, the app is responsive and works on both mobile and desktop devices.

**Q: How do I report a bug or request a feature?**
A: Please open an issue on the [GitHub repository](https://github.com/i228808/Weather-App/issues).
