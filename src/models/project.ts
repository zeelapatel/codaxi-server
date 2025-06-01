import { Sequelize, DataTypes, Model } from 'sequelize';

class Project extends Model {
  public id!: string;
  public name!: string;
  public description!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initProject = (sequelize: Sequelize) => {
  Project.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'Projects',
      sequelize: sequelize,
    }
  );

  return Project;
};

// Remove this line: initProject(sequelize);

export { Project, initProject };