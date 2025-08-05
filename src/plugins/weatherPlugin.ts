import axios from 'axios';
import { Plugin, PluginResult } from '../types';

export class WeatherPlugin implements Plugin {
  name = 'weather';
  description = 'Get weather information for a location';

  async execute(query: string): Promise<PluginResult> {
    try {
      // Extract location from query
      const locationMatch = query.match(/weather\s+(?:in\s+)?([a-zA-Z\s,]+)/i);
      if (!locationMatch) {
        return {
          success: false,
          error: 'Location not found in query. Please specify a location like "weather in London"'
        };
      }

      const location = locationMatch[1].trim();
      
      // Use a free weather API (OpenWeatherMap has a free tier)
      const apiKey = process.env.WEATHER_API_KEY;
      let weatherData;

      if (apiKey) {
        // Use OpenWeatherMap API if key is provided
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`
        );
        weatherData = response.data;
      } else {
        // Mock weather data for demo purposes
        weatherData = this.getMockWeatherData(location);
      }

      return {
        success: true,
        data: weatherData
      };
    } catch (error) {
      console.error('Weather plugin error:', error);
      return {
        success: false,
        error: 'Failed to get weather information'
      };
    }
  }

  private getMockWeatherData(location: string) {
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Clear'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const temperature = Math.floor(Math.random() * 30) + 10; // 10-40°C
    
    return {
      location: location,
      condition: randomCondition,
      temperature: temperature,
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      description: `${randomCondition} weather in ${location} with temperature around ${temperature}°C`
    };
  }
} 