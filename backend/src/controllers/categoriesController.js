import {
  DEAL_CATEGORIES,
  PROHIBITED_CATEGORIES,
  getAllCategories,
  getSubcategories,
  getCategoryByKey,
  getSubcategoryByKey,
  isShariahCompliant,
  CATEGORY_KEYS,
  ALL_SUBCATEGORY_KEYS,
} from '../constants/categories.js';

/**
 * Get all main categories
 * GET /api/categories
 */
export const getCategories = async (req, res) => {
  try {
    const categories = getAllCategories();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message,
    });
  }
};

/**
 * Get specific category by key with its subcategories
 * GET /api/categories/:categoryKey
 */
export const getCategoryWithSubcategories = async (req, res) => {
  try {
    const { categoryKey } = req.params;

    const category = getCategoryByKey(categoryKey);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category '${categoryKey}' not found`,
      });
    }

    const subcategories = getSubcategories(categoryKey);

    res.status(200).json({
      success: true,
      data: {
        ...category,
        subcategories,
      },
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message,
    });
  }
};

/**
 * Get all categories with their subcategories (full tree)
 * GET /api/categories/tree
 */
export const getCategoriesTree = async (req, res) => {
  try {
    const categoriesTree = Object.values(DEAL_CATEGORIES).map(category => ({
      key: category.key,
      label: category.label,
      icon: category.icon,
      description: category.description,
      shariah_compliant: category.shariah_compliant,
      subcategories: Object.values(category.subcategories),
    }));

    res.status(200).json({
      success: true,
      count: categoriesTree.length,
      data: categoriesTree,
    });
  } catch (error) {
    console.error('Error fetching categories tree:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories tree',
      error: error.message,
    });
  }
};

/**
 * Get subcategories for a specific category
 * GET /api/categories/:categoryKey/subcategories
 */
export const getSubcategoriesForCategory = async (req, res) => {
  try {
    const { categoryKey } = req.params;

    const category = getCategoryByKey(categoryKey);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category '${categoryKey}' not found`,
      });
    }

    const subcategories = getSubcategories(categoryKey);

    res.status(200).json({
      success: true,
      count: subcategories.length,
      data: subcategories,
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategories',
      error: error.message,
    });
  }
};

/**
 * Validate if a category is Shariah-compliant
 * GET /api/categories/:categoryKey/validate
 */
export const validateShariahCompliance = async (req, res) => {
  try {
    const { categoryKey } = req.params;

    const category = getCategoryByKey(categoryKey);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category '${categoryKey}' not found`,
      });
    }

    const compliant = isShariahCompliant(categoryKey);

    res.status(200).json({
      success: true,
      data: {
        category: categoryKey,
        shariah_compliant: compliant,
        label: category.label,
      },
    });
  } catch (error) {
    console.error('Error validating Shariah compliance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate Shariah compliance',
      error: error.message,
    });
  }
};

/**
 * Get prohibited categories list
 * GET /api/categories/prohibited
 */
export const getProhibitedCategories = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: PROHIBITED_CATEGORIES.length,
      data: PROHIBITED_CATEGORIES,
      message: 'These categories are NOT allowed on OWNLY platform',
    });
  } catch (error) {
    console.error('Error fetching prohibited categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prohibited categories',
      error: error.message,
    });
  }
};

/**
 * Search categories and subcategories by keyword
 * GET /api/categories/search?q=keyword
 */
export const searchCategories = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query parameter "q" is required',
      });
    }

    const searchTerm = q.toLowerCase();
    const results = [];

    // Search through all categories and subcategories
    Object.values(DEAL_CATEGORIES).forEach(category => {
      // Check if category matches
      if (
        category.label.toLowerCase().includes(searchTerm) ||
        category.description.toLowerCase().includes(searchTerm) ||
        category.key.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          type: 'category',
          key: category.key,
          label: category.label,
          description: category.description,
          icon: category.icon,
        });
      }

      // Check subcategories
      Object.values(category.subcategories).forEach(subcategory => {
        if (
          subcategory.label.toLowerCase().includes(searchTerm) ||
          subcategory.key.toLowerCase().includes(searchTerm)
        ) {
          results.push({
            type: 'subcategory',
            key: subcategory.key,
            label: subcategory.label,
            category: {
              key: category.key,
              label: category.label,
            },
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      query: q,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error('Error searching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search categories',
      error: error.message,
    });
  }
};
