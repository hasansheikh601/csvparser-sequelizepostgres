import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    username: {
      type: DataTypes.STRING(100),
    },
    dob: {
      type: DataTypes.STRING,
    },
    company: {
      type: DataTypes.STRING(100),
    },
    address: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    salary: {
      type: DataTypes.NUMBER,
    },
    about: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING(100),
    },
    managedBy: {
      type: DataTypes.STRING,
      references: {
        model: "employees",
        key: "id",
      },
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "employees",
    timestamps: true,
  }
);

Employee.hasMany(Employee, {
  as: "children", // Alias for subordinates
  foreignKey: "managedBy",
  sourceKey: "id",
});

Employee.belongsTo(Employee, {
  as: "parent", // Alias for the manager
  foreignKey: "managedBy",
  targetKey: "id",
});

export default Employee;
