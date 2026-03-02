const Company = require('../models/Company');

// @desc    Get all companies
// @route   GET /api/v1/companies
// @access  Public
exports.getCompanies = async (req, res, next) => {
  try {
    let query;

    //  Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit','llimit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Advanced filtering ($gt, $gte, $lt, $lte, $in)
    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      match => `$${match}`
    );

    // Finding resource
    query = Company.find(JSON.parse(queryStr)).populate('interviews');

    // Select
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    //  Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // default
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await Company.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const companies = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: companies.length,
      pagination,
      data: companies
    });

  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false
    });
  }
};
exports.getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: company
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.createCompany = async (req, res, next) => {
  const company = await Company.create(req.body);

  res.status(201).json({
    success: true,
    data: company
  });
};

exports.updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!company) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: company
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    //  This triggers cascade middleware
    await company.deleteOne(); 
    // or: await company.remove();

    res.status(200).json({
      success: true,
      data: {}
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Cannot delete company'
    });
  }
};
