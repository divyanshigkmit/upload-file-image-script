"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize) => {
  class EmployeeFamily extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Employee, {
        foreignKey: "employeeId",
        targetKey: "id",
        as: "employee family",
      });
    }
  }
  EmployeeFamily.init(
    {
      employee_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "employee",
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING,
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "EmployeeFamily",
      tableName: "employee_family",
    }
  );
  return EmployeeFamily;
};
