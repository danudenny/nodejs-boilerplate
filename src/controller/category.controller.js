const db = require("../../database/models");
const Category = db.categories;
const Op = db.Sequelize.Op;
const buildPaginator = require('pagination-apis');
const { success, error } = require("../middleware/responseApi");

function getCategoryQueryFilter(req) {
  let whereConditions = {};
  if (req.query.name) {
    whereConditions.name = {
      [Op.like]: '%' + (req.query.name) + '%'
    }
  }
  return whereConditions;
}

exports.list = async (req, res) => {
  const { page, limit, skip, paginate } = buildPaginator({
    url: `${req.protocol}://${req.get('host')}/api/categories`,
    limit: (!req.query.limit) ? parseInt(req.query.limit) : 10,
    page: parseInt(req.query.page)
  });

  const {count, rows} = await Category.findAndCountAll({
    page,
    limit,
    offset: skip,
    where: getCategoryQueryFilter(req),
  });
  console.log(rows)
  if (Object.keys(rows).length === 0) {
    res
      .status(400)
      .json(success("No Category Data Available", rows, res.statusCode));
  }
  res
    .status(200)
    .json(success("Success Get all Category Data", paginate(rows, count), res.statusCode));
}

exports.create = async (req, res) => {
  const findCategory = await Category.findOne({
    where: {
      name: req.body.name,
    }
  })
  if(findCategory) {
    res
      .status(400)
      .json(error(`Category '${req.body.name}' is already exist`, res.statusCode));
  }

  const payload = {
    name: req.body.name,
  }

  try {
    const createCategory = await Category.create(payload)
    res
      .status(200)
      .json(success("Success Create Category", createCategory, res.statusCode));

  } catch (err) {
    res
      .status(400)
      .json(error(`Failed create Category`, res.statusCode, err.message));
  }

}

exports.find = async (req, res) => {
  const getCategory = await Category.findOne({
    where: {
      id: req.params.id
    }
  })
  if(!getCategory) {
    res
      .status(400)
      .json(success(`No Category with ID '${req.params.id}' found`, res.statusCode));
  }

  res
    .status(200)
    .json(success("Success Find Category", getCategory, res.statusCode));
}

exports.update = async (req, res) => {
  const payload = {
    name: req.body.name
  }
  try {
    const updateCategory = await Category.update(payload, {
      where: {
        id: req.params.id
      }
    })

    console.log(updateCategory[0] === 0)
    if(updateCategory[0] === 0) {
      res
        .status(400)
        .json(success(`No Category with ID '${req.params.id}' found`, res.statusCode));
    }
    res
      .status(200)
      .json(success("Success Update Category", res.statusCode));
  } catch (err) {
    res
      .status(400)
      .json(error(`Failed update Category`, res.statusCode, err.message));
  }
}

exports.delete = async (req, res) => {
  try {
    await Category.destroy({
      where: {
        id: req.params.id
      }
    })
      .then((result) => {
        if (!result) {
          res
            .status(400)
            .json(error(`No Category with ID '${req.params.id}' found`, res.statusCode));
        }
        res
          .status(200)
          .json(success("Success Delete Category", res.statusCode));
      })
  } catch (err) {
    res
      .status(400)
      .json(error(`Failed delete category`, res.statusCode, err.message));
  }

}

exports.activate = async (req, res) => {
  const checkId = await Category.findOne({
    where: {
      id: req.params.id
    }
  })
  if(!checkId) {
    res
      .status(400)
      .json(success(`No Category with ID '${req.params.id}' found`, res.statusCode));
  }

  const payload = {
    isActive: true
  }
  try{
    const activate = await Category.update(payload, {
      where: {
        id: req.params.id,
        isActive: false
      }
    })
    if (activate[0] === 0) {
      res
        .status(400)
        .json(success(`ID '${req.params.id}' already a Active`, res.statusCode));
    }
    res
      .status(200)
      .json(success("Success Activate Category", res.statusCode));
  } catch (err) {
    res
      .status(400)
      .json(error(`Failed update Category`, res.statusCode, err.message));
  }

}

exports.nonactivate = async (req, res) => {
  const checkId = await Category.findOne({
    where: {
      id: req.params.id
    }
  })
  if(!checkId) {
    res
      .status(400)
      .json(success(`No Category with ID '${req.params.id}' found`, res.statusCode));
  }

  const payload = {
    isActive: false
  }
  try{
    const activate = await Category.update(payload, {
      where: {
        id: req.params.id,
        isActive: true
      }
    })
    if (activate[0] === 0) {
      res
        .status(400)
        .json(success(`ID '${req.params.id}' already Non Active`, res.statusCode));
    }
    res
      .status(200)
      .json(success("Success Non Activate Category", res.statusCode));
  } catch (err) {
    res
      .status(400)
      .json(error(`Failed update Category`, res.statusCode, err.message));
  }

}

exports.parent = async (req, res) => {
  const checkId = await Category.findOne({
    where: {
      id: req.params.id
    }
  })
  if(!checkId) {
    res
      .status(400)
      .json(success(`No Category with ID '${req.params.id}' found`, res.statusCode));
  }

  const payload = {
    isParent: true
  }
  try{
    const activate = await Category.update(payload, {
      where: {
        id: req.params.id,
        isParent: false
      }
    })
    if (activate[0] === 0) {
      res
        .status(400)
        .json(success(`ID '${req.params.id}' already a Parent`, res.statusCode));
    }
    res
      .status(200)
      .json(success("Success Make Parent Category", res.statusCode));
  } catch (err) {
    res
      .status(400)
      .json(error(`Failed update Category`, res.statusCode, err.message));
  }

}

exports.child = async (req, res) => {
  const checkId = await Category.findOne({
    where: {
      id: req.params.id
    }
  })
  if(!checkId) {
    res
      .status(400)
      .json(success(`No Category with ID '${req.params.id}' found`, res.statusCode));
  }

  const payload = {
    isParent: false
  }
  try{
    const activate = await Category.update(payload, {
      where: {
        id: req.params.id,
        isParent: true
      }
    })
    if (activate[0] === 0) {
      res
        .status(400)
        .json(success(`ID '${req.params.id}' already a Child`, res.statusCode));
    }
    res
      .status(200)
      .json(success("Success Make Child Category", res.statusCode));
  } catch (err) {
    res
      .status(400)
      .json(error(`Failed update Category`, res.statusCode, err.message));
  }

}

