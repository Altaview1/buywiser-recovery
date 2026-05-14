/**
 * VTON Letter Template Variables
 * These are the available variables that can be used in letter templates.
 * Use the format ${variable_name} to insert them.
 */

export const TEMPLATE_VARIABLES = {
  // Personal Information
  first_name: {
    label: 'First Name',
    category: 'Personal',
    example: 'John',
    placeholder: 'Veteran\'s first name'
  },
  last_name: {
    label: 'Last Name',
    category: 'Personal',
    example: 'Smith',
    placeholder: 'Veteran\'s last name'
  },
  
  // Property Information
  property_address: {
    label: 'Property Address',
    category: 'Property',
    example: '1234 Oak Avenue',
    placeholder: 'Current home address'
  },
  city: {
    label: 'City',
    category: 'Property',
    example: 'Los Angeles',
    placeholder: 'City name'
  },
  state: {
    label: 'State',
    category: 'Property',
    example: 'CA',
    placeholder: 'State code (2 letters)'
  },
  zip_code: {
    label: 'Zip Code',
    category: 'Property',
    example: '90001',
    placeholder: 'ZIP/postal code'
  },
  
  // Benefit Information
  estimated_benefit: {
    label: 'Estimated GAP Benefit',
    category: 'Benefits',
    example: '$15,000',
    placeholder: 'Formatted benefit amount'
  },
  estimated_equity: {
    label: 'Estimated Equity',
    category: 'Benefits',
    example: '$250,000',
    placeholder: 'Home equity value'
  },
  listing_price: {
    label: 'Listing Price',
    category: 'Benefits',
    example: '$500,000',
    placeholder: 'Property listing price'
  },
};

export const VARIABLE_CATEGORIES = {
  Personal: ['first_name', 'last_name'],
  Property: ['property_address', 'city', 'state', 'zip_code'],
  Benefits: ['estimated_benefit', 'estimated_equity', 'listing_price'],
};

/**
 * Get the template syntax for a variable
 * @param {string} variableName - The variable name
 * @returns {string} The template syntax like ${variable_name}
 */
export const getVariableSyntax = (variableName) => `\$\{${variableName}\}`;

/**
 * Get all variables grouped by category
 * @returns {object} Variables organized by category
 */
export const getVariablesByCategory = () => {
  const grouped = {};
  Object.entries(VARIABLE_CATEGORIES).forEach(([category, variables]) => {
    grouped[category] = variables.map(varName => ({
      name: varName,
      ...TEMPLATE_VARIABLES[varName],
    }));
  });
  return grouped;
};