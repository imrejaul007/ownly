import express from 'express';
import {
  getCategories,
  getCategoryWithSubcategories,
  getCategoriesTree,
  getSubcategoriesForCategory,
  validateShariahCompliance,
  getProhibitedCategories,
  searchCategories,
} from '../controllers/categoriesController.js';

const router = express.Router();

/**
 * @route   GET /api/categories
 * @desc    Get all main categories
 * @access  Public
 */
router.get('/', getCategories);

/**
 * @route   GET /api/categories/tree
 * @desc    Get all categories with subcategories (full tree)
 * @access  Public
 */
router.get('/tree', getCategoriesTree);

/**
 * @route   GET /api/categories/prohibited
 * @desc    Get list of prohibited (non-Shariah compliant) categories
 * @access  Public
 */
router.get('/prohibited', getProhibitedCategories);

/**
 * @route   GET /api/categories/search
 * @desc    Search categories and subcategories by keyword
 * @access  Public
 * @query   q - Search query string
 */
router.get('/search', searchCategories);

/**
 * @route   GET /api/categories/:categoryKey
 * @desc    Get specific category with its subcategories
 * @access  Public
 */
router.get('/:categoryKey', getCategoryWithSubcategories);

/**
 * @route   GET /api/categories/:categoryKey/subcategories
 * @desc    Get subcategories for a specific category
 * @access  Public
 */
router.get('/:categoryKey/subcategories', getSubcategoriesForCategory);

/**
 * @route   GET /api/categories/:categoryKey/validate
 * @desc    Validate if a category is Shariah-compliant
 * @access  Public
 */
router.get('/:categoryKey/validate', validateShariahCompliance);

export default router;
