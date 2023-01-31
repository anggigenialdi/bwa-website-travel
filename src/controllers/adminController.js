const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const path = require("path");
const fs = require("fs");

function viewDashboard(req, res) {
  res.render('admin/dashboard/view_dashboard');
}

async function viewCategory(req, res) {
  try {
    const category = await Category.find();
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = {
      message: alertMessage,
      status: alertStatus
    }
    res.render('admin/category/view_category', {
      category,
      alert
    });
  } catch (error) {
    res.redirect('/admin/category');
  }
}

async function addCategory(req, res) {
  try {
    const {
      name
    } = req.body;
    await Category.create({
      name,
    });
    req.flash('alertMessage', 'Succes Add Category')
    req.flash('alertStatus', 'success')
    res.redirect('/admin/category');
  } catch (error) {
    console.log(error);
    req.flash('alertMessage', `$error.message`)
    req.flash('alertStatus', 'danger')
  }

}
async function deleteCategory(req, res) {
  try {
    const {
      id
    } = req.params;
    const category = await Category.findOne({
      _id: id
    })
    await category.remove();
    req.flash('alertMessage', 'Succes Delete Data')
    req.flash('alertStatus', 'success')
    res.redirect('/admin/category')

  } catch (error) {
    req.flash('alertMessage', `$error.message`)
    req.flash('alertStatus', 'danger')
    res.redirect('/admin/category')
  }

}

async function editCategory(req, res) {
  const {
    id,
    name
  } = req.body;
  const category = await Category.findOne({
    _id: id
  });
  category.name = name;

  await category.save();
  res.redirect('/admin/category')

}

async function viewBank(req, res) {
  try {
    const bank = await Bank.find();
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = {
      message: alertMessage,
      status: alertStatus
    }

    res.render('admin/bank/view_bank', {
      title: "Staycation | Bank",
      bank,
      alert
    });

  } catch (error) {
    res.redirect('/admin/bank');
  }
}

async function addBank(req, res) {
  try {
    const {
      nameBank,
      nomorRekening,
      name,
    } = req.body;
    await Bank.create({
      nameBank,
      nomorRekening,
      name,
      imageUrl: `images/${req.file.filename}`

    })
    req.flash('alertMessage', 'Succes Add Bank')
    req.flash('alertStatus', 'success')
    res.redirect('/admin/bank');

  } catch (error) {
    console.log(error);
    req.flash('alertMessage', `$error.message`)
    req.flash('alertStatus', 'danger')
    res.redirect('/admin/bank');

  }
}

async function editBank(req, res) {
  try {
    const {
      id,
      name,
      nameBank,
      nomorRekening
    } = req.body;

    const bank = await Bank.findOne({
      _id: id
    })

    if (req.file == undefined) {
      bank.name = name;
      bank.nameBank = nameBank;
      bank.nomorRekening = nomorRekening;
      await bank.save();
      req.flash('alertMessage', 'Succes Update Bank')
      req.flash('alertStatus', 'success')
      res.redirect('/admin/bank');
    } else {
      fs.unlinkSync(`src/public/${bank.imageUrl}`);
      bank.name = name;
      bank.nameBank = nameBank;
      bank.nomorRekening = nomorRekening;
      bank.imageUrl = `images/${req.file.filename}`;
      await bank.save();
      req.flash('alertMessage', 'Succes Update Bank')
      req.flash('alertStatus', 'success')
      res.redirect('/admin/bank');
    }
  } catch (error) {
    console.log(error);
    req.flash('alertMessage', `$error.message`)
    req.flash('alertStatus', 'danger')
    res.redirect('/admin/bank');

  }

}

async function deleteBank(req, res) {
  try {
    const {
      id
    } = req.params;
    const bank = await Bank.findOne({
      _id: id
    })
    fs.unlinkSync(`src/public/${bank.imageUrl}`);
    await bank.remove();
    req.flash('alertMessage', 'Succes Delete Data Bank')
    req.flash('alertStatus', 'success')
    res.redirect('/admin/bank');

  } catch (error) {
    console.log(error);
    req.flash('alertMessage', `$error.message`)
    req.flash('alertStatus', 'danger')
    res.redirect('/admin/bank');

  }
}


async function viewItem(req, res) {
  try {
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = {
      message: alertMessage,
      status: alertStatus
    }

    const category = await Category.find();
    res.render('admin/item/view_item', {
      title: "Staycation | Item",
      category,
      alert,
    });


  } catch (error) {
    req.flash('alertMessage', `$error.message`)
    req.flash('alertStatus', 'danger')
    res.redirect('/admin/item');

  }
}

async function addItem(req, res) {
  try {
    const {
      categoryId,
      title,
      price,
      city,
      about
    } = req.body;
    if (req.files.length > 0) {
      const category = await Category.findOne({
        _id: categoryId
      });
      const newItem = {
        categoryId: category._id,
        title,
        description: about,
        price,
        city
      }
      const item = await  Item.create(newItem);
      category.itemId.push({
        _id: item._id
      });
      await category.save();
      
      for (let i = 0; i < req.files.length; i++) {
        const imageSave = await Image.create({ imageUrl: `images/${req.files[i].filename}`});
        item.imageId.push({ _id: imageSave._id });
        await item.save();
      }
      req.flash('alertMessage', 'Succes Add Items')
      req.flash('alertStatus', 'success')
      res.redirect('/admin/item');

    }

  } catch (error) {
    console.log(error);
    req.flash('alertMessage', error.message)
    req.flash('alertStatus', 'danger')
    res.redirect('/admin/item');
  }
}

function viewBooking(req, res) {
  res.render('admin/booking/view_booking');
}

module.exports = {

  viewDashboard,
  viewCategory,
  addCategory,
  viewBank,
  editBank,
  viewItem,
  addItem,
  viewBooking,
  deleteCategory,
  editCategory,
  addBank,
  deleteBank
}