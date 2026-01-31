
import { Rule, DataRecord, RuleEvaluationResult, BatchProcessingResult, RuleSeverity } from '../types';

/**
 * Evaluates a single record against a list of rules
 */
export const evaluateRules = (
  record: DataRecord,
  rules: Rule[]
): RuleEvaluationResult[] => {
  return rules
    .filter(rule => rule.isActive)
    .map(rule => {
      let isPassed = false;
      let message = '';

      try {
        // Safe context for evaluation
        const context = { data: record };
        // Basic implementation using Function constructor for 'plug-and-play' logic
        // In a production environment, use a safer expression parser like jexl or similar
        const conditionFn = new Function('data', `return ${rule.condition}`);
        isPassed = !!conditionFn(record);
        
        message = isPassed 
          ? `Rule '${rule.name}' passed.` 
          : `Violation: ${rule.description} (Action: ${rule.action})`;
      } catch (e) {
        isPassed = false;
        message = `Execution Error in rule '${rule.name}': ${e instanceof Error ? e.message : 'Unknown error'}`;
      }

      return {
        ruleId: rule.id,
        ruleName: rule.name,
        isPassed,
        message,
        severity: rule.severity,
        department: rule.department
      };
    });
};

/**
 * Processes a batch of data records
 */
export const processBatch = (
  data: DataRecord[],
  rules: Rule[]
): BatchProcessingResult[] => {
  return data.map((record, index) => {
    const results = evaluateRules(record, rules);
    return {
      recordIndex: index,
      results,
      transformedData: { ...record } // Add transformation logic here if rules define 'action' as code
    };
  });
};
