const Category = require("../models/Category");

const createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if(!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}

		//create CategorysDetails in DB;
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
	
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};

const showAllCategories = async (req, res) => {
	try {
		const allCategorys = await Category.find({},{ name: true, description: true });
		
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

const categoryPageDetails = async (req, res) => {
	try {
		const { categoryId } = req.body;                           //fetch data;

		const selectedCategory = await Category.findById(categoryId).populate("courses") .exec();     // Get courses for the specified category

		if (!selectedCategory) {                                                  // Handle the case when the category is not found
			return res
				.status(404)
				.json({ success: false, message: "Category not found" });
		}
		 
		if (selectedCategory.courses.length === 0){                              // Handle the case when there are no courses
			return res.status(404).json({
				success: false,
				message: "No courses found for the selected category.",
			});
		}

		const selectedCourses = selectedCategory.courses;

		const categoriesExceptSelected = await Category.find({_id: { $ne: categoryId },}).populate("courses");      // Get courses for other categories
		let differentCourses = [];
		for(const category of categoriesExceptSelected) {
			differentCourses.push(...category.courses);
		}

		// Get top-selling courses across all categories
		const allCategories = await Category.find().populate("courses");
		const allCourses = allCategories.flatMap((category) => category.courses);
		const mostSellingCourses = allCourses.sort((a, b) => b.sold - a.sold).slice(0, 10);
			
		return res.status(200).json({
			selectedCourses: selectedCourses,
			differentCourses: differentCourses,
			mostSellingCourses: mostSellingCourses,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

module.exports =  {createCategory , showAllCategories , categoryPageDetails};