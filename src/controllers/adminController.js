const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const path = require("path");
const fs = require("fs");
const Feature = require('../models/Feature');
const Activity = require('../models/Activity');
const {
  log
} = require('console');

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

    const item = await Item.find().populate({
      path: `imageId`,
      select: `id imageUrl`
    }).populate({
      path: `categoryId`,
      select: `id name`
    });
    const category = await Category.find();
    res.render('admin/item/view_item', {
      title: "Staycation | Item",
      category,
      alert,
      item,
      action: "view"
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
      const item = await Item.create(newItem);
      category.itemId.push({
        _id: item._id
      });
      await category.save();

      for (let i = 0; i < req.files.length; i++) {
        const imageSave = await Image.create({
          imageUrl: `images/${req.files[i].filename}`
        });
        item.imageId.push({
          _id: imageSave._id
        });
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

async function showImageItem(req, res) {
  try {
    const {
      id
    } = req.params;
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = {
      message: alertMessage,
      status: alertStatus
    }

    const item = await Item.findOne({
        _id: id
      })
      .populate({
        path: `imageId`,
        select: `id imageUrl`
      });
    res.render('admin/item/view_item', {
      title: "Staycation | View Image",
      alert,
      item,
      action: "show image",
    });

  } catch (error) {
    console.log(error);
    req.flash('alertMessage', error.message)
    req.flash('alertStatus', 'danger')
    res.redirect('/admin/item');
  }

}

async function showEditItem(req, res) {
  try {
    const {
      id
    } = req.params;
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = {
      message: alertMessage,
      status: alertStatus
    }

    const item = await Item.findOne({
        _id: id
      })
      .populate({
        path: `imageId`,
        select: `id imageUrl`
      }).populate({
        path: `categoryId`,
        select: `id name`
      });
    const category = await Category.find();

    res.render('admin/item/view_item', {
      title: "Staycation | Edit Item",
      category,
      alert,
      item,
      action: "edit",
    });

  } catch (error) {
    console.log(error);
    req.flash('alertMessage', error.message)
    req.flash('alertStatus', 'danger')
    res.redirect('/admin/item');
  }

}

async function editItem(req, res) {
  try {
    const {
      id
    } = req.params;
    const {
      categoryId,
      title,
      price,
      city,
      about
    } = req.body;

    const item = await Item.findOne({
        _id: id
      })
      .populate({
        path: `imageId`,
        select: `id imageUrl`
      }).populate({
        path: `categoryId`,
        select: `id name`
      });

    if (req.files.length > 0) {
      for (let i = 0; i < item.imageId.length; i++) {
        const imageUpdate = await Image.findOne({
          _id: item.imageId[i]._id
        });
        fs.unlinkSync(`src/public/${imageUpdate.imageUrl}`);
        imageUpdate.imageUrl = `images/${req.files[i].filename }`;
        await imageUpdate.save();
      }
      item.title = title;
      item.price = price;
      item.city = city;
      item.description = about;
      item.categoryId = categoryId;
      await item.save();
      req.flash('alertMessage', 'Succes Update Items')
      req.flash('alertStatus', 'success')
      res.redirect('/admin/item');

    } else {
      item.title = title;
      item.price = price;
      item.city = city;
      item.description = about;
      item.categoryId = categoryId;
      await item.save();
      req.flash('alertMessage', 'Succes Update Items')
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

async function deleteItem(req, res) {
  try {
    const {
      id
    } = req.params;
    const item = await Item.findOne({
      _id: id
    }).populate('imageId');
    for (let i = 0; i < item.imageId.length; i++) {
      Image.findOne({
        _id: item.imageId[i]._id
      }).then((image) => {

        fs.unlinkSync(`src/public/${image.imageUrl}`);
        image.remove();

      }).catch((error) => {
        console.log(error);
        req.flash('alertMessage', error.message)
        req.flash('alertStatus', 'danger')
        res.redirect('/admin/item');
      });
    }

    await item.remove();

    req.flash('alertMessage', 'Succes Delete Items')
    req.flash('alertStatus', 'success')
    res.redirect('/admin/item');

  } catch (error) {
    console.log(error);
    req.flash('alertMessage', error.message)
    req.flash('alertStatus', 'danger')
    res.redirect('/admin/item');
  }

}

async function viewDetailItem(req, res) {
  const {
    itemId
  } = req.params;

  try {
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = {
      message: alertMessage,
      status: alertStatus
    };

    const feature = await Feature.find({
      itemId: itemId
    });

    const activity = await Activity.find({
      itemId: itemId
    });

    res.render('admin/item/detail_item/view_detail_item', {
      title: 'Staycation | Detail Item',
      alert,
      itemId,
      feature,
      activity
    })
  } catch (error) {
    console.log(error);
    req.flash('alertMessage', error.message)
    req.flash('alertStatus', 'danger')
    res.redirect(`/admin/item/show-detail-item/${itemId}`);
  }
}

async function addFeature(req, res) {
  const {
    name,
    qty,
    itemId,
  } = req.body;
  try {

    if (!req.file) {
      req.flash('alertMessage', 'image not found')
      req.flash('alertStatus', 'danger')
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
    const feature = await Feature.create({
      name,
      qty,
      itemId,
      imageUrl: `images/${req.file.filename}`

    });

    const item = await Item.findOne({
      _id: itemId
    });
    item.featureId.push({
      _id: feature._id
    });
    await item.save();

    req.flash('alertMessage', 'Succes Add Feature')
    req.flash('alertStatus', 'success')
    res.redirect(`/admin/item/show-detail-item/${itemId}`);

  } catch (error) {
    console.log(error);
    req.flash('alertMessage', `$error.message`)
    req.flash('alertStatus', 'danger')
    res.redirect(`/admin/item/show-detail-item/${itemId}`);

  }
}

async function editFeature(req, res) {
  const {
    id,
    name,
    qty,
    itemId
  } = req.body;

  try {

    const feature = await Feature.findOne({
      _id: id
    })

    if (req.file == undefined) {
      feature.name = name;
      feature.qty = qty;
      await feature.save();
      req.flash('alertMessage', 'Succes Update Feature')
      req.flash('alertStatus', 'success')
      res.redirect(`/admin/item/show-detail-item/${itemId}`);

    } else {
      fs.unlinkSync(`src/public/${feature.imageUrl}`);
      feature.name = name;
      feature.qty = qty;
      feature.imageUrl = `images/${req.file.filename}`;
      await feature.save();
      req.flash('alertMessage', 'Succes Update Feature')
      req.flash('alertStatus', 'success')
      res.redirect(`/admin/item/show-detail-item/${itemId}`);

    }
  } catch (error) {
    console.log(error);
    req.flash('alertMessage', `$error.message`)
    req.flash('alertStatus', 'danger')
    res.redirect(`/admin/item/show-detail-item/${itemId}`);


  }

}

async function deleteFeature(req, res) {
  const {
    id,
    itemId
  } = req.params;
  try {

    const feature = await Feature.findOne({
      _id: id
    })
    const item = await Item.findOne({ _id: itemId }).populate('featureId');
    for (let i = 0; i < item.featureId.length; i++) {
      if (item.featureId[i]._id.toString() === feature._id.toString() ) {
        item.featureId.pull({ _id: feature._id });
        await item.save();
        
      }
    }
    fs.unlinkSync(`src/public/${feature.imageUrl}`);
    await feature.remove();
    req.flash('alertMessage', 'Succes Delete Data Feature')
    req.flash('alertStatus', 'success')
    res.redirect(`/admin/item/show-detail-item/${itemId}`);

  } catch (error) {
    console.log(error);
    req.flash('alertMessage', `$error.message`)
    req.flash('alertStatus', 'danger')
    res.redirect(`/admin/item/show-detail-item/${itemId}`);

  }
}

function viewBooking(req, res) {
  res.render('admin/booking/view_booking');
}

async function addActivity(req, res) {
  const {
    name,
    type,
    itemId,
  } = req.body;

  try {

    if (!req.file) {
      req.flash('alertMessage', 'image not found')
      req.flash('alertStatus', 'danger')
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
    const activity = await Activity.create({
      name,
      type,
      itemId,
      imageUrl: `images/${req.file.filename}`

    });

    const item = await Item.findOne({
      _id: itemId
    });

    item.activityId.push({
      _id: activity._id
    });

    await item.save();

    req.flash('alertMessage', 'Succes Add Activity')
    req.flash('alertStatus', 'success')
    res.redirect(`/admin/item/show-detail-item/${itemId}`);

  } catch (error) {
    console.log(error);
    req.flash('alertMessage', error)
    req.flash('alertStatus', 'danger')
    res.redirect(`/admin/item/show-detail-item/${itemId}`);

  }
}

async function editActivity(req, res) {
  const {
    id,
    name,
    type,
    itemId
  } = req.body;

  try {

    const acitivy = await Activity.findOne({
      _id: id
    })

    if (req.file == undefined) {
      acitivy.name = name;
      acitivy.type = type;
      await acitivy.save();

      req.flash('alertMessage', 'Succes Update Activity')
      req.flash('alertStatus', 'success')
      res.redirect(`/admin/item/show-detail-item/${itemId}`);

    } else {
      fs.unlinkSync(`src/public/${acitivy.imageUrl}`);
      acitivy.name = name;
      acitivy.type = type;
      acitivy.imageUrl = `images/${req.file.filename}`;
      await acitivy.save();
      req.flash('alertMessage', 'Succes Update Activity')
      req.flash('alertStatus', 'success')
      res.redirect(`/admin/item/show-detail-item/${itemId}`);

    }
  } catch (error) {
    console.log(error);
    req.flash('alertMessage', `$error.message`)
    req.flash('alertStatus', 'danger')
    res.redirect(`/admin/item/show-detail-item/${itemId}`);


  }

}

async function deleteActivity(req, res) {
  const {
    id,
    itemId
  } = req.params;
  try {

    const activity = await Activity.findOne({
      _id: id
    })
    const item = await Item.findOne({ _id: itemId }).populate('activityId');
    for (let i = 0; i < item.activityId.length; i++) {
      if (item.activityId[i]._id.toString() === activity._id.toString() ) {
        item.activityId.pull({ _id: activity._id });
        await item.save();
        
      }
    }
    fs.unlinkSync(`src/public/${activity.imageUrl}`);
    await activity.remove();
    req.flash('alertMessage', 'Succes Delete Data Activity')
    req.flash('alertStatus', 'success')
    res.redirect(`/admin/item/show-detail-item/${itemId}`);

  } catch (error) {
    console.log(error);
    req.flash('alertMessage', `$error.message`)
    req.flash('alertStatus', 'danger')
    res.redirect(`/admin/item/show-detail-item/${itemId}`);

  }
}

module.exports = {

  viewDashboard,
  viewCategory,
  addCategory,
  viewBank,
  editBank,
  viewItem,
  addItem,
  showImageItem,
  showEditItem,
  editItem,
  deleteItem,
  viewDetailItem,


  viewBooking,
  deleteCategory,
  editCategory,
  addBank,
  deleteBank,
  addFeature,
  editFeature,
  deleteFeature,

  addActivity,
  editActivity,
  deleteActivity

}