import { Plugin, PluginResult } from '../types';

export class MathPlugin implements Plugin {
  name = 'math';
  description = 'Evaluate mathematical expressions';

  async execute(query: string): Promise<PluginResult> {
    try {
      // Extract mathematical expression from query
      const mathMatch = query.match(/(\d+(?:\s*[\+\-\*\/\^\(\)]\s*\d+)+)/);
      if (!mathMatch) {
        return {
          success: false,
          error: 'No mathematical expression found. Please provide an expression like "2 + 2 * 5"'
        };
      }

      const expression = mathMatch[1];
      const result = this.evaluateExpression(expression);

      return {
        success: true,
        data: {
          expression: expression,
          result: result,
          description: `${expression} = ${result}`
        }
      };
    } catch (error) {
      console.error('Math plugin error:', error);
      return {
        success: false,
        error: 'Failed to evaluate mathematical expression'
      };
    }
  }

  private evaluateExpression(expression: string): number {
    // Remove all spaces and convert to lowercase
    const cleanExpression = expression.replace(/\s/g, '').toLowerCase();
    
    // Basic validation - only allow numbers, operators, and parentheses
    if (!/^[\d\+\-\*\/\(\)\.]+$/.test(cleanExpression)) {
      throw new Error('Invalid characters in expression');
    }

    // Use Function constructor for safe evaluation
    // This is a simple approach - in production, you'd want a more robust math parser
    try {
      // Replace ^ with ** for exponentiation
      const jsExpression = cleanExpression.replace(/\^/g, '**');
      const result = new Function(`return ${jsExpression}`)();
      
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Invalid result');
      }
      
      return result;
    } catch (error) {
      throw new Error('Invalid mathematical expression');
    }
  }
} 