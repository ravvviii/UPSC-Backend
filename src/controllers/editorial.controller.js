import Editorial from "../models/Editorial.js";

// 👉 POST /api/editorials
export const createEditorial = async (req, res) => {
    console.log("Yaha req aaya ");
    
  try {
    const {
      title,
      image,
      shortDescription,
      fullContent,
      author,
      paperName,
      editorialDate
    } = req.body;

    // ✅ Default image logic
    const defaultImage = "https://placehold.co/600x400?text=Editorial+Article";
    const editorialImage = image && image.trim() !== "" ? image : defaultImage;

    const newEditorial = new Editorial({
      title,
      image: editorialImage,
      shortDescription,
      fullContent,
      author,
      paperName,
      editorialDate
    });

    await newEditorial.save();
    res.status(201).json({
      message: "✅ Editorial created successfully",
      editorial: newEditorial
    });
  } catch (err) {
    console.error("❌ Error creating editorial:", err);
    res.status(500).json({ error: err.message });
  }
};


export const getAllEditorials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default 1
    const limit = 10; // fixed items per page
    const skip = (page - 1) * limit;

    // Get total count
    const total = await Editorial.countDocuments();

    // Paginated data
    const editorials = await Editorial.find()
      .sort({ insertedAt: -1 , _id: -1})
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      editorials,
    });
  } catch (err) {
    console.error("Error fetching editorials:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};



// 👉 GET /api/editorials/:id
export const getEditorialById = async (req, res) => {
  try {
    const editorial = await Editorial.findById(req.params.id);
    if (!editorial) return res.status(404).json({ error: "Editorial not found" });
    res.json(editorial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👉 DELETE /api/editorials/:id
export const deleteEditorial = async (req, res) => {
  try {
    const deleted = await Editorial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Editorial not found" });
    res.json({ message: "Editorial deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👉 PUT /api/editorials/:id
export const updateEditorial = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      image,
      shortDescription,
      fullContent,
      author,
      paperName,
      editorialDate,
    } = req.body;

    // Find the existing editorial
    const editorial = await Editorial.findById(id);
    if (!editorial)
      return res.status(404).json({ error: "Editorial not found" });

    // ✅ Update only provided fields
    editorial.title = title ?? editorial.title;
    editorial.image =
      image && image.trim() !== ""
        ? image
        : editorial.image || "https://placehold.co/600x400?text=Editorial+Article";
    editorial.shortDescription =
      shortDescription ?? editorial.shortDescription;
    editorial.fullContent = fullContent ?? editorial.fullContent;
    editorial.author = author ?? editorial.author;
    editorial.paperName = paperName ?? editorial.paperName;
    editorial.editorialDate = editorialDate ?? editorial.editorialDate;

    await editorial.save();

    res.status(200).json({
      message: "✅ Editorial updated successfully",
      editorial,
    });
  } catch (err) {
    console.error("❌ Error updating editorial:", err);
    res.status(500).json({ error: err.message });
  }
};

