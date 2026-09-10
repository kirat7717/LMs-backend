  import SuperAdmin from "../models/superAdmin.model.js";
  import {
    superAdminLoginSchema,
    superAdminForgotPasswordSchema,
    superAdminResetPasswordSchema,
    superAdminUpdateProfileSchema,
  } from "../validations/superAdmin.validation.js";

  import {
    sendSuperAdminPasswordResetEmail,
    sendSuperAdminPasswordChangedEmail,
    sendSuperAdminProfileUpdatedEmail,
  } from "../services/emails/superAdminEmail.service.js";

  import { comparePassword, hashPassword } from "../utils/password.util.js";
  import { generateAccessToken } from "../utils/jwt.util.js";
  import {
    generateVerificationToken,
    generateTokenExpiry,
  } from "../utils/verificationToken.util.js";
  import { createAdminSchema } from "../validations/admin.validataion.js";
  import Admin from "../models/admin.model.js";
  import { sendAdminInvitationEmail } from "../services/emails/adminEmail.service.js";

  // Super Admin login
  const loginSuperAdmin = async (req, res) => {
    try {
      const { error, value } = superAdminLoginSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const { email, password } = value;

      const superAdmin = await SuperAdmin.findOne({ email });

      if (!superAdmin) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      if (superAdmin.isBlocked) {
        return res.status(403).json({
          success: false,
          message: "Your Super Admin account has been blocked",
        });
      }

      if (!superAdmin.isActive) {
        return res.status(403).json({
          success: false,
          message: "Your Super Admin account is inactive",
        });
      }

      const isPasswordMatch = await comparePassword(
        password,
        superAdmin.password
      );

      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const token = generateAccessToken(
        superAdmin._id,
        "superAdmin"
      );

      return res.status(200).json({
        success: true,
        message: "Super Admin logged in successfully",
        data: {
          token,
          superAdmin: {
            id: superAdmin._id,
            name: superAdmin.name,
            email: superAdmin.email,
            isActive: superAdmin.isActive,
          },
        },
      });
    } catch (error) {
      console.error("Super Admin login error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };

  // Forgot Super Admin password
  const forgotSuperAdminPassword = async (req, res) => {
    try {
      const { error, value } =
        superAdminForgotPasswordSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const { email } = value;

      const superAdmin = await SuperAdmin.findOne({ email });

      if (!superAdmin) {
        return res.status(404).json({
          success: false,
          message: "Super Admin account not found",
        });
      }

      const resetToken = generateVerificationToken();
      const resetExpires = generateTokenExpiry(15);

      superAdmin.passwordResetToken = resetToken;
      superAdmin.passwordResetExpires = resetExpires;

      await superAdmin.save();

      try {
        await sendSuperAdminPasswordResetEmail(
          superAdmin,
          resetToken
        );
      } catch (emailError) {
        console.error(
          "Super Admin password reset email failed:",
          emailError.message
        );
      }

      return res.status(200).json({
        success: true,
        message: "Password reset email sent successfully",
      });
    } catch (error) {
      console.error(
        "Forgot Super Admin password error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };

  // Reset Super Admin password
  const resetSuperAdminPassword = async (req, res) => {
    try {
      const { error, value } =
        superAdminResetPasswordSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const { token, password } = value;

      const superAdmin = await SuperAdmin.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() },
      });

      if (!superAdmin) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired password reset token",
        });
      }

      superAdmin.password = await hashPassword(password);
      superAdmin.passwordResetToken = null;
      superAdmin.passwordResetExpires = null;

      await superAdmin.save();

      try {
        await sendSuperAdminPasswordChangedEmail(superAdmin);
      } catch (emailError) {
        console.error(
          "Super Admin password changed email failed:",
          emailError.message
        );
      }

      return res.status(200).json({
        success: true,
        message: "Super Admin password reset successfully",
      });
    } catch (error) {
      console.error(
        "Reset Super Admin password error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };

  // Update Super Admin profile
  const updateSuperAdminProfile = async (req, res) => {
    try {
      const { error, value } =
        superAdminUpdateProfileSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const superAdmin = req.superAdmin;

      if (value.name !== undefined) {
        superAdmin.name = value.name;
      }

      if (value.bio !== undefined) {
        superAdmin.bio = value.bio;
      }

      if (value.avatar !== undefined) {
        superAdmin.avatar = value.avatar;
      }

      await superAdmin.save();

      try {
        await sendSuperAdminProfileUpdatedEmail(superAdmin);
      } catch (emailError) {
        console.error(
          "Super Admin profile update email failed:",
          emailError.message
        );
      }

      return res.status(200).json({
        success: true,
        message: "Super Admin profile updated successfully",
        data: {
          superAdmin: {
            id: superAdmin._id,
            name: superAdmin.name,
            email: superAdmin.email,
            bio: superAdmin.bio,
            avatar: superAdmin.avatar,
          },
        },
      });
    } catch (error) {
      console.error(
        "Update Super Admin profile error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };

  // Create Admin
  const createAdmin = async (req, res) => {
    try {
      const { error, value } = createAdminSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const { name, email } = value;

      const existingAdmin = await Admin.findOne({ email });

      if (existingAdmin) {
        return res.status(409).json({
          success: false,
          message: "Admin with this email already exists",
        });
      }

      const setupToken = generateVerificationToken();
      const setupExpires = generateTokenExpiry(30);

      const admin = await Admin.create({
        name,
        email,
        password: null,
        isActive: false,
        isBlocked: false,
        adminSetupToken: setupToken,
        adminSetupExpires: setupExpires,
      });

      try {
        await sendAdminInvitationEmail(admin, setupToken);
      } catch (emailError) {
        console.error(
          "Admin invitation email failed:",
          emailError.message
        );
      }

      return res.status(201).json({
        success: true,
        message: "Admin created successfully. Setup email sent.",
        data: {
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            isActive: admin.isActive,
            isBlocked: admin.isBlocked,
          },
        },
      });
    } catch (error) {
      console.error("Create admin error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };
  // ==================== GET SUPER ADMIN PROFILE ====================

  const getSuperAdminProfile = async (req, res) => {
    try {
      // Super Admin is already fetched by superAdminMiddleware
      return res.status(200).json({
        success: true,
        message: "Super Admin profile fetched successfully",
        data: req.superAdmin,
      });
    } catch (error) {
      // Handle profile fetch errors
      console.error("Get Super Admin profile error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };
  export {
    loginSuperAdmin,
    forgotSuperAdminPassword,
    resetSuperAdminPassword,
    updateSuperAdminProfile,
    getSuperAdminProfile,
    createAdmin
  };