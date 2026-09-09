import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "LMS Backend API",
      version: "1.0.0",
      description: "Backend API for E-Learning Management System",
    },

    servers: [
      {
        url: "http://localhost:9000",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: ["./src/docs/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;