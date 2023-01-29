import Brand from '../models/Brand';

const createBrand = async (req, res) => {
  try {
    const brand = new Brand({
      name: req.body.name,
      description: req.body.description,
      logo: req.body.logo,
    });
    await brand.save();
    res.status(201).json({
      message: 'Brand created successfully',
      brand,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, logo } = req.body;
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { name, description, logo },
      { new: true }
    );
    if (!updatedBrand) {
      return res.status(404).json({ msg: 'Brand not found' });
    }
    return res.json(updatedBrand);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server Error');
  }
};

const getBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Error getting brand', error });
  }
};

const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    return res.status(200).json({
      data: brands,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server Error',
    });
  }
};

export { createBrand, updateBrand, getAllBrands, getBrand };
