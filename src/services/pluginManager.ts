import { Plugin, PluginResult } from '../types';
import { WeatherPlugin } from '../plugins/weatherPlugin';
import { MathPlugin } from '../plugins/mathPlugin';

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();

  constructor() {
    // Register default plugins
    this.registerPlugin(new WeatherPlugin());
    this.registerPlugin(new MathPlugin());
  }

  registerPlugin(plugin: Plugin): void {
    this.plugins.set(plugin.name, plugin);
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  async executePlugin(pluginName: string, query: string): Promise<PluginResult> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      return {
        success: false,
        error: `Plugin '${pluginName}' not found`
      };
    }

    try {
      return await plugin.execute(query);
    } catch (error) {
      console.error(`Error executing plugin ${pluginName}:`, error);
      return {
        success: false,
        error: `Failed to execute plugin '${pluginName}'`
      };
    }
  }

  detectPluginIntent(query: string): { pluginName: string; confidence: number } | null {
    const lowerQuery = query.toLowerCase();
    
    // Check for weather intent
    if (lowerQuery.includes('weather') || lowerQuery.includes('temperature') || lowerQuery.includes('forecast')) {
      return { pluginName: 'weather', confidence: 0.9 };
    }
    
    // Check for math intent
    if (lowerQuery.match(/\d+\s*[\+\-\*\/\^\(\)]\s*\d+/) || 
        lowerQuery.includes('calculate') || 
        lowerQuery.includes('math') || 
        lowerQuery.includes('equation')) {
      return { pluginName: 'math', confidence: 0.8 };
    }
    
    return null;
  }
} 