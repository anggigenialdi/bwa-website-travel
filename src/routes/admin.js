const router= require('express').Router();
const adminController = require('../controllers/adminController');
const { upload, uploadMultiple } = require('../middlewares/multer.js');

router.get('/dashboard', adminController.viewDashboard);

router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.delete('/category/:id', adminController.deleteCategory);
router.put('/category', adminController.editCategory);

router.get('/bank', adminController.viewBank);
router.post('/bank', upload, adminController.addBank);
router.put('/bank', upload, adminController.editBank);
router.delete('/bank/:id', adminController.deleteBank) ;


router.get('/item', adminController.viewItem);
router.post('/item', uploadMultiple , adminController.addItem);
router.get('/item/show-image/:id', adminController.showImageItem);


router.get('/booking', adminController.viewBooking);

module.exports = router;