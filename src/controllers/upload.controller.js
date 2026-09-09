// ==================== UPLOAD IMAGE ====================

const uploadImage = async (req, res) => {
  try {
    // Check whether an image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // Generate public URL for uploaded image
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: imageUrl,
      },
    });
  } catch (error) {
    // Handle image upload errors
    console.error("Upload image error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export { uploadImage };