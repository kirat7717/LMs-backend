import Course from "../models/course.model.js";
import Category from "../models/category.model.js";
import Teacher from "../models/teacher.model.js";
import Admin from "../models/admin.model.js";

import {
  courseQuerySchema,
  createCourseSchema,
  updateCourseSchema,
  createSectionSchema,
  updateSectionSchema,
} from "../validations/course.validation.js";

import {
  sendCourseSubmissionEmail,
  sendAdminNewCourseEmail,
  sendCourseUpdateEmail,

} from "../services/emails/courseEmail.service.js";
import paginate from "../utils/pagination.util.js";

// Create course
const createCourse = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = createCourseSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const {
      title,
      description,
      thumbnail,
      categoryId,
      price,
      sections,
    } = value;

    // Check whether category exists and is active
    const category = await Category.findOne({
      _id: categoryId,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found or inactive",
      });
    }

    // Get logged-in teacher
    const teacher = await Teacher.findById(req.teacher._id).select(
      "name email"
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Create course
    const course = await Course.create({
      title,
      description,
      thumbnail,
      category: category._id,
      teacher: teacher._id,
      price,
      sections,
      approvalStatus: "pending",
    });

    // Send course submission email to teacher
    try {
      await sendCourseSubmissionEmail(course, teacher);
    } catch (emailError) {
      console.error(
        "Course submission email failed:",
        emailError.message
      );
    }

    // Get all active and unblocked admins
    const admins = await Admin.find({
      isActive: true,
      isBlocked: false,
    }).select("email");

    // Notify all active and unblocked admins
    for (const admin of admins) {
      try {
        await sendAdminNewCourseEmail(
          course,
          teacher,
          admin.email
        );
      } catch (emailError) {
        console.error(
          `Admin course notification failed for ${admin.email}:`,
          emailError.message
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: "Course created successfully and is pending approval",
      data: {
        course: {
          id: course._id,
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail,
          category: course.category,
          teacher: course.teacher,
          price: course.price,
          sections: course.sections,
          approvalStatus: course.approvalStatus,
          createdAt: course.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Create course error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Update own course
const updateCourse = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = updateCourseSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Find course
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Teacher can update only their own course
    if (course.teacher.toString() !== req.teacher._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own course",
      });
    }

    // Check new category only when category is being changed
    if (value.categoryId !== undefined) {
      const category = await Category.findOne({
        _id: value.categoryId,
        isActive: true,
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found or inactive",
        });
      }
    }

    // Prepare update data
    const updateData = { ...value };

    // Convert categoryId to category
    if (value.categoryId !== undefined) {
      updateData.category = value.categoryId;
      delete updateData.categoryId;
    }

    // Update course
    // Approval status is intentionally NOT changed here.
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    // Send update confirmation email to the teacher
    try {
      await sendCourseUpdateEmail(updatedCourse, req.teacher);
    } catch (emailError) {
      // Email failure should not fail the course update
      console.error(
        "Course update email failed:",
        emailError.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: {
        course: updatedCourse,
      },
    });
  } catch (error) {
    console.error("Update course error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const addSection = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = createSectionSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Find course
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check teacher ownership
    if (course.teacher.toString() !== req.teacher._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this course",
      });
    }

    // Create new section
    const newSection = {
      title: value.title,
      lectures: [],
    };

    // Add lecture if provided
    if (value.lecture) {
      newSection.lectures.push({
        title: value.lecture.title,
        thumbnail: value.lecture.thumbnail || "",
        videoUrl: value.lecture.videoUrl || "",
        duration: value.lecture.duration || 0,
      });
    }

    // Add section to course
    course.sections.push(newSection);

    // Save updated course
    await course.save();

    return res.status(201).json({
      success: true,
      message: value.lecture
        ? "Section and lecture added successfully"
        : "Section added successfully",
      data: course,
    });
  } catch (error) {
    console.error("Add Section Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add section",
    });
  }
};

export const updateSection = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = updateSectionSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Find course
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check teacher ownership
    if (course.teacher.toString() !== req.teacher._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this course",
      });
    }

    // Update section title
    if (value.title) {
      await Course.findByIdAndUpdate(
        req.params.courseId,
        {
          $set: {
            "sections.$[section].title": value.title,
          },
        },
        {
          arrayFilters: [
            { "section._id": req.params.sectionId },
          ],
          new: true,
          runValidators: true,
        }
      );
    }

    // Add lecture
    if (value.lecture && !value.lectureId) {
      await Course.findByIdAndUpdate(
        req.params.courseId,
        {
          $push: {
            "sections.$[section].lectures": value.lecture,
          },
        },
        {
          arrayFilters: [
            { "section._id": req.params.sectionId },
          ],
          new: true,
          runValidators: true,
        }
      );
    }

    // Update lecture
    if (value.lectureId && value.lecture) {
      await Course.findByIdAndUpdate(
        req.params.courseId,
        {
          $set: {
            "sections.$[section].lectures.$[lecture].title":
              value.lecture.title,
            "sections.$[section].lectures.$[lecture].thumbnail":
              value.lecture.thumbnail,
            "sections.$[section].lectures.$[lecture].videoUrl":
              value.lecture.videoUrl,
            "sections.$[section].lectures.$[lecture].duration":
              value.lecture.duration,
          },
        },
        {
          arrayFilters: [
            { "section._id": req.params.sectionId },
            { "lecture._id": value.lectureId },
          ],
          new: true,
          runValidators: true,
        }
      );
    }

    // Get updated course
    const updatedCourse = await Course.findById(req.params.courseId);

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Update Section Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update section",
    });
  }
};
export const deleteSection = async (req, res) => {
  try {
    // Find course
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check teacher ownership
    if (
      course.teacher.toString() !== req.teacher._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this course",
      });
    }

    // Find section
    const section = course.sections.id(req.params.sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // Delete complete section
    // All lectures inside this section will also be deleted
    section.deleteOne();

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Section and all its lectures deleted successfully",
    });
  } catch (error) {
    console.error("Delete Section Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete section",
    });
  }
};
export const deleteLecture = async (req, res) => {
  try {
    // Find course
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check teacher ownership
    if (
      course.teacher.toString() !== req.teacher._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this course",
      });
    }

    // Find section
    const section = course.sections.id(req.params.sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // Find lecture
    const lecture = section.lectures.id(req.params.lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // Delete lecture
    lecture.deleteOne();

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    console.error("Delete Lecture Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete lecture",
    });
  }
};
// ==================== GET ALL AVAILABLE COURSES ====================




// ==================== GET ALL COURSES ====================

const getCourses = async (req, res) => {
  try {
    // Validate query parameters
    const { error, value } = courseQuerySchema.validate(req.query);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { search, category, page, limit } = value;

    // Only approved and active courses are publicly visible
    const filter = {
      approvalStatus: "approved",
      isActive: true,
    };

    // Search course by title
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    // Search category by name
    if (category) {
      const categoryData = await Category.findOne({
        name: category,
        isActive: true,
      })
        .select("_id")
        .lean();

      if (!categoryData) {
        return res.status(404).json({
          success: false,
          message: "Category not found or inactive",
        });
      }

      // Use category ID internally after finding it by name
      filter.category = categoryData._id;
    }

    // Get paginated courses
    const result = await paginate({
      model: Course,
      filter,
      page,
      limit,

      // Return only fields needed for course listing
      select:
        "title description thumbnail category teacher price createdAt updatedAt",

      populate: [
        {
          path: "category",
          match: { isActive: true },
          select: "name description",
        },
        {
          path: "teacher",
          select: "name avatar",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    // Handle course listing errors
    console.error("Get courses error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ==================== GET COURSE DETAILS ====================

const getCourseDetail = async (req, res) => {
  try {
    // Find only approved and active courses
    const course = await Course.findOne({
      _id: req.params.id,
      approvalStatus: "approved",
      isActive: true,
    })
      .select(
        "title description thumbnail category teacher price sections createdAt updatedAt"
      )
      .populate({
        path: "category",
        match: { isActive: true },
        select: "name description",
      })
      .populate({
        path: "teacher",
        select: "name avatar bio",
      })
      .lean();

    // Check whether course exists
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or unavailable",
      });
    }

    // Check whether category is still active
    if (!course.category) {
      return res.status(404).json({
        success: false,
        message: "Course category not found or inactive",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: {
        course,
      },
    });
  } catch (error) {
    // Handle course details errors
    console.error("Get course details error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};



// ==================== GET TEACHER COURSES ====================

const getTeacherCourses = async (req, res) => {
  try {
    // Find all courses created by logged-in teacher
    const courses = await Course.find({
      teacher: req.teacher._id,
    })
      .populate("category", "name description")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Teacher courses fetched successfully",
      data: {
        courses,
      },
    });
  } catch (error) {
    console.error("Get teacher courses error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
// ==================== GET TEACHER COURSE DETAILS ====================

const getTeacherCourseDetail = async (req, res) => {
  try {
    // Find course created by logged-in teacher
    const course = await Course.findOne({
      _id: req.params.id,
      teacher: req.teacher._id,
    })
      .populate("category", "name description")
      .populate("teacher", "name email")
      .lean();

    // Check whether course exists
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: {
        course,
      },
    });
  } catch (error) {
    console.error(
      "Get teacher course details error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
// ==================== UPLOAD LECTURE VIDEO ====================
const uploadLectureVideo = async (req, res) => {
  try {
    // Check whether a video was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video is required",
      });
    }

    // Find course
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Teacher can update only their own course
    if (course.teacher.toString() !== req.teacher._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own course",
      });
    }

    // Find section
    const section = course.sections.id(req.params.sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // Find lecture
    const lecture = section.lectures.id(req.params.lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // Generate public video URL
    const videoUrl = `${process.env.BASE_URL}/videos/${req.file.filename}`;

    // Save video URL
    lecture.videoUrl = videoUrl;

    // Save course
    // Approval status is NOT changed
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Lecture video uploaded successfully",
      data: {
        videoUrl,
        courseId: course._id,
        sectionId: section._id,
        lectureId: lecture._id,
      },
    });
  } catch (error) {
    console.error("Upload lecture video error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


export {
  createCourse,
  updateCourse,
  getCourses,
  getCourseDetail,
  getTeacherCourses,
  getTeacherCourseDetail,
  uploadLectureVideo,
};